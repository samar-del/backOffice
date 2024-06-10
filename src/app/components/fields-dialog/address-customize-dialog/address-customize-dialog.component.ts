import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {TranslationService} from "../../../services/translation.service";

@Component({
  selector: 'app-address-customize-dialog',
  templateUrl: './address-customize-dialog.component.html',
  styleUrls: ['./address-customize-dialog.component.css']
})
export class AddressCustomizeDialogComponent implements OnInit {
 form: FormGroup;
  previewForm: FormGroup;
  newField: FormlyFieldConfig;
  fields: FormlyFieldConfig[] = [];
  @ViewChild('formlyForm') formlyForm: any;
  options: FormlyFormOptions = {};
  model: any = {};
  selectedTabIndex = 0; // Default tab index
  translations: any = {};
  showTable = false; // Variable to store the state of the checkbox
  NumberOptions = 0 ;
  // @ts-ignore
  // @ts-ignore
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddressCustomizeDialogComponent>,
    private translationService: TranslationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {}
  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.form = this.fb.group({
      label_fr: [this.data.label_fr, Validators.required],
      label_ar: [this.data.label_ar, Validators.required],
      custom_css: [this.data.custom_css],
      required: [this.data.required],
      error_label: [this.data.error_label],
      custom_error_message: [this.data.custom_error_message],
      property_name: [this.generatePropertyName(this.data.label)],
      field_tags: [this.data.field_tags],
      tableRows: this.fb.array([]),
      label:[this.data.label],
      label_row:[this.data.label_row],
      placeholder_row: [this.data.placeholder_row]
    });

    // Subscribe to label changes to update property name
    this.form.get('label_fr').valueChanges.subscribe((label: string) => {
      const propertyNameControl = this.form.get('property_name');
      propertyNameControl.setValue(this.generatePropertyName(label));
    });

    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.loadTranslations();
    });

    this.form.valueChanges.subscribe(() => {
      this.updateFields();
    });

    this.updateFields();

    this.loadTranslations();

    this.toggleTableVisibility();

  }
  toggleTableVisibility(): void {
    this.showTable = !this.showTable;
    //this.cdr.detectChanges();
  }
  getLabelStyles(): any {
    const customCss = this.form.get('custom_css').value;
    return customCss ? { 'cssText': customCss } : {}; // Return inline styles object
  }
  updateFormGroup(index: number, controlName: string, value: any): void {
    const tableRowsArray = this.form.get('tableRows') as FormArray;
    const rowFormGroup = tableRowsArray.at(index) as FormGroup;
    rowFormGroup.controls[controlName].setValue(value);
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
  onNoClick(): void {
    this.dialogRef.close();
  }
  get tableRows(): FormArray {
    return this.form.get('tableRows') as FormArray;
  }

  createRow(): FormGroup {
    const row = this.fb.group({
      label_row: [''],
      placeholder_row: [''],
    });
    return row;
  }
  addRow(): void {
    const tableRowsArray = this.form.get('tableRows') as FormArray;
    tableRowsArray.push(this.createRow());
    this.NumberOptions++ ;
  }

  removeRow(index: number): void {
    this.tableRows.removeAt(index);
    this.NumberOptions--;
  }
  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
  }
  updateTags(inputValue: string): void {
    const tagsArray = inputValue.split(',').map(tag => tag.trim());
    this.form.get('field_tags').setValue(tagsArray);
  }

  loadTranslations() {
    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.translationService.loadTranslations(language).subscribe((translations: any) => {
        console.log('Loaded translations:', translations);
        this.translations = translations;
      });
    });
  }

  updateFields(): void {
    this.translationService.getCurrentLanguage().subscribe((currentLanguage: string) => {
      const label_fr = this.form.get('label_fr').value;
      const label_ar = this.form.get('label_ar').value;
      const textLabel = currentLanguage === 'ar' ? label_ar : label_fr;
      // Clear existing fields
      this.fields = [];

      // If NumberOptions is zero, create a single field using the main form labels
      if (this.NumberOptions === 0) {
        this.newField = {
          key: 'key',
          type: 'input',
          templateOptions: {
            label: textLabel,
            type:'address',
            placeholder: this.form.get('placeholder_row').value,
            custom_css: this.form.get('custom_css').value,
            error_label: this.form.get('error_label').value,
            custom_error_message: this.form.get('custom_error_message').value,
          },
        };
        this.fields.push(this.newField);
      } else {
        // Iterate over each row in the tableRows array to create fields
        const tableRowsArray = this.form.get('tableRows') as FormArray;
        tableRowsArray.controls.forEach((row, index) => {
          const rowFormGroup = row as FormGroup;
          const labelRow = rowFormGroup.get('label_row').value;
          const placeholderRow = rowFormGroup.get('placeholder_row').value;

          this.newField = {
            key: `key_${index}`,
            type: 'input',
            templateOptions: {
              label: labelRow,
              type:'address',
              placeholder: placeholderRow,
              custom_css: this.form.get('custom_css').value,
              error_label: this.form.get('error_label').value,
              custom_error_message: this.form.get('custom_error_message').value,
            },
          };
          this.fields.push(this.newField);
        });
      }
    });
  }

}
