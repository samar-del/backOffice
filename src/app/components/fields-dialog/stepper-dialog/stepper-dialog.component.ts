import {Component, ComponentFactoryResolver, Inject, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslationService } from '../../../services/translation.service';
import { ShareService } from '../../../services/share.service';

@Component({
  selector: 'app-stepper-dialog',
  templateUrl: './stepper-dialog.component.html',
  styleUrls: ['./stepper-dialog.component.css']
})
export class StepperDialogComponent implements OnInit {
  form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  model: any = {};
  selectedTabIndex = 0;
  translations: any = {};
  fieldsList: any[] = [];
  private fieldsListSub: Subscription;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StepperDialogComponent>,
    private translationService: TranslationService,
    private shareService: ShareService,
    private componentFactoryResolver: ComponentFactoryResolver,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fieldsListSub = this.shareService.fieldsList$.subscribe(data => {
      this.fieldsList = data;
    });
  }

  ngOnInit() {
    console.log(this.fieldsList);
    this.form = this.fb.group({
      label_fr: [this.data.label_fr, Validators.required],
      label_ar: [this.data.label_ar, Validators.required],
      custom_css: [this.data.custom_css],
      hidden: [this.data.hidden],
      hide_label_fr: [this.data.hide_label_fr],
      hide_label_ar: [this.data.hide_label_ar],
      stepper_orientation: [this.data.stepper_orientation || 'horizontal'], // default to horizontal
      property_name: [this.generatePropertyName(this.data.label_fr)],
      field_tags: [this.data.field_tags],
      stepperLabels: this.fb.array([])
    });

    if (this.data.steps) {
      this.data.steps.forEach((stepLabel: string) => {
        this.stepperLabels.push(this.fb.group({ label: [stepLabel] }));
      });
    }

    this.form.get('label_fr').valueChanges.subscribe((label: string) => {
      const propertyNameControl = this.form.get('property_name');
      propertyNameControl.setValue(this.generatePropertyName(label));
    });

    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.loadTranslations();
    });

    this.loadTranslations();



    this.form.valueChanges.subscribe(() => {
      this.updateFields();
    });

    this.updateFields();
  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }

  get stepperLabels(): FormArray {
    return this.form.get('stepperLabels') as FormArray;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getLabelStyles(): any {
    const customCssControl = this.form.get('custom_css');
    if (customCssControl && customCssControl.value) {
      return { 'cssText': customCssControl.value };
    } else {
      return {};
    }
  }

  generatePropertyName(label: string): string {
    const words = label.split(/\s+/); // Split label into words
    let propertyName = '';

    // Iterate over each word to construct property name
    words.forEach((word, index) => {
      // Skip whitespace or empty words
      if (word.trim() === '') {
        return;
      }

      // Make the first word lowercase
      if (index === 0) {
        propertyName += word.toLowerCase();
      } else {
        // Make the first letter of subsequent words uppercase
        propertyName += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    });

    return propertyName;
  }

  loadTranslations() {
    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.translationService.loadTranslations(language).subscribe((translations: any) => {
        console.log('Loaded translations:', translations);
        this.translations = translations;
      });
    });
  }

  updateTags(inputValue: string): void {
    const tagsArray = inputValue.split(',').map(tag => tag.trim());
    this.form.get('field_tags').setValue(tagsArray);
  }

  addTabLabel(): void {
    const tabLabels = this.form.get('tabLabels') as FormArray;
    tabLabels.push(this.fb.group({
      label: [''],
    }));
  }

  createRow(): FormGroup {
    return this.fb.group({
      label: [''],
    });
  }

  addRow(): void {
    this.stepperLabels.push(this.createRow());
  }

  removeStep(index: number): void {
    this.stepperLabels.removeAt(index);
  }

  updateFields(): void {
    const stepperLabels = this.stepperLabels;
    const fields: FormlyFieldConfig[] = stepperLabels.controls.map((control: FormGroup, index: number) => {
      const stepLabel = control.get('label').value;
      return {
        key: 'step_' + index,
        type: this.form.get('stepper_orientation').value === 'horizontal' ? 'hr_stepper' : 'vr_stepper',
        templateOptions: {
          label: stepLabel,
        },
      };
    });

    this.newField = {
      type: this.form.get('stepper_orientation').value === 'horizontal' ? 'hr_stepper' : 'vr_stepper',
      fieldGroup: fields,
      templateOptions: {
        label: this.form.get('label_fr').value,
        steps: stepperLabels.value.map(step => step.label),
        stepper_orientation: this.form.get('stepper_orientation').value,
      },
    };
  }


}
