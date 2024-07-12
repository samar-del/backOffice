import {Component, DoCheck, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {FormContentService} from "../../../../services/form-content.service";
import {ActivatedRoute} from "@angular/router";
import {TranslationService} from "../../../../services/translation.service";
import {ShareService} from "../../../../services/share.service";
import {forkJoin} from "rxjs";
import {Options} from "../../../../models/Options";
import {FormCreationService} from "../../../../services/form-creation.service";
import {FieldService} from "../../../../services/field.service";

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class UpdateFormComponent implements OnInit, DoCheck {
  form: FormGroup;
  formHeader: FormGroup;
  formExist = false;
  fields: FormlyFieldConfig[] = [];
  newFields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {};
  model: any = {};
  @ViewChild('formlyForm') formlyForm: any;
  formId: string;
  langue: string;
  formTitle: string;
  formDescription: string;
  private changes = false;
  translations: any = {};

  constructor(
    private fb: FormBuilder,
    private formService: FormContentService,
    private formCreationService: FormCreationService,
    private fieldService : FieldService,
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private shareService: ShareService,
    private fbh: FormBuilder
  ) {
    this.form = this.fb.group({});
    this.formHeader = this.fbh.group({
      title: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.loadTranslations();
    });
    this.langue = localStorage.getItem('language');
    this.route.params.subscribe((params) => {
      this.formId = params['id']; // (+) converts string 'id' to a number
      this.getFormTemplateById();
    });
    this.translationService
      .getCurrentLanguage()
      .subscribe((language: string) => {
        this.langue = language;
        // Update form fields on language change
        this.updateFormLabel(language);
      });
    this.form.valueChanges.subscribe((values) => {
      console.log('Form Values:', values);
      console.log('Model:', this.model);
    });

    this.loadTranslations();
  }
  loadTranslations() {
    this.translationService.getCurrentLanguage().subscribe((language: string) => {
      this.translationService.loadTranslations(language).subscribe((translations: any) => {
        console.log('Loaded translations:', translations);
        this.translations = translations;
      });
    });
  }
  updateFormLabel(langue: string) {
    this.fields.forEach((el) => {
      if (langue === 'ar') {
        el.templateOptions.label = el.templateOptions.label_ar;
        el.templateOptions.placeholder = el.templateOptions.placeholder_ar;
      } else if (langue === 'fr' || langue === 'an') {
        el.templateOptions.label = el.templateOptions.label_fr;
        el.templateOptions.placeholder = el.templateOptions.placeholder_fr;
      }
    });
  }
  async getFormTemplateById() {
    try {
      const res = await this.formService.getFormTemplateById(this.formId).toPromise();

      this.formTitle = res.title;
      this.formDescription = res.description;
      this.formExist = true;

      if (!res.fieldIds || res.fieldIds.length === 0) {
        return;
      }

      const fieldObservables = res.fieldIds.map((el: string) => this.formService.getFieldById(el));
      const fields = await forkJoin(fieldObservables).toPromise();

      await this.processFields(fields);

      this.fields = fields;
      this.initializeFormControls(fields);

      console.log('Form Controls:', this.form.controls);
      console.log('Initial Model:', this.model);
      console.log('Fields:', this.fields);
    } catch (error) {
      console.error(error);
    }
  }

  private async processFields(fields: any[]): Promise<void> {
    for (let field of fields) {
      if (field.templateOptions.options) {
        field.templateOptions.disabled = false;

        if (field.type === 'iframe') {
          const link_iframe = field.templateOptions.link_iframe;
          this.shareService.changeUrl(link_iframe);
        }

        const optionsObservables = field.templateOptions.options.map(
          (op: string) => this.formService.getOptionsById(op)
        );
        const options = await forkJoin(optionsObservables).toPromise();

        const newFieldOptions: Options[] = field.templateOptions.options.map((op: string) => {
          return options.find((opt) => opt.id === op);
        }).filter(opt => opt !== undefined);

        field.templateOptions.options = newFieldOptions;
        this.options = field.templateOptions.options;
      }

      if (field.fieldGroup && field.fieldGroup.length > 0) {
        let fieldGroupObservables = [] ;
        field.fieldGroup.map((el) => {
          if ( el && el.id !== undefined ){
            fieldGroupObservables.push(this.formService.getFieldById(el?.id));
          }else {
            fieldGroupObservables.push(this.formService.getFieldById(el));
          }
        } );
        let fieldGroup = await forkJoin(fieldGroupObservables).toPromise();

        for (const fieldGroupElement of fieldGroup) {
          if (fieldGroupElement.fieldGroupId && fieldGroupElement.fieldGroupId.length > 0) {
            let fieldGroupElmObservables = fieldGroupElement.fieldGroupId.map((el: string) => this.formService.getFieldById(el));
            let fieldGroupFields = await forkJoin(fieldGroupElmObservables).toPromise();
            fieldGroupElement.fieldGroup= [...fieldGroupFields] ;
            console.log(fieldGroupElement);
            fieldGroupElmObservables = null ;
            fieldGroupFields = null ;
          }
        }

        field.fieldGroup = fieldGroup;
        fieldGroupObservables = null ;
        fieldGroup = null;
        await this.processFields(field.fieldGroup); // Recursively process nested fields
        this.changes = true;

      }
    }
  }
  // tslint:disable-next-line:typedef
  initializeFormControls(fields: FormlyFieldConfig[]) {
    const initializeFieldControl = (field: FormlyFieldConfig, parentKey: string = '') => {
      const key = parentKey ? `${parentKey}.${field.key}` : field.key;

      if (field.fieldGroup && field.fieldGroup.length > 0) {
        field.fieldGroup.forEach((nestedField) => initializeFieldControl(nestedField, key));
      } else {
        const control = this.fb.control(field.defaultValue || '');
        this.form.addControl(key.toString(), control);

        // Update model when control value changes
        control.valueChanges.subscribe((value) => {
          this.setModelValue(key.toString(), value);
        });

        // Set initial model value
        this.setModelValue(key.toString(), control.value);
      }
    };

    fields.forEach((field) => initializeFieldControl(field));

    // Log the model after form controls are initialized
    console.log('Model after initializing form controls:', this.model);
  }

  setModelValue(key: string, value: any) {
    const keys = key.split('.');
    let modelPart = this.model;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!modelPart[keys[i]]) {
        modelPart[keys[i]] = {};
      }
      modelPart = modelPart[keys[i]];
    }
    modelPart[keys[keys.length - 1]] = value;
  }

  updateForm(formId: string, formTemplate: { title: string, version: number, createdAt: Date, description: string }) {
    this.formCreationService.updateFormTemplate(formTemplate, formId).subscribe(
      res => {
        console.log('Form template updated:', res);
      },
      err => console.error('Error updating form template:', err)
    );
  }

  saveForm() {
    const titre = this.formHeader.get('title')?.value;
    const description = this.formHeader.get('description')?.value;
    const formTemplate = {
      title: titre,
      version: 1,
      createdAt: new Date(),
      description: description
    };

    this.updateForm(this.formId, formTemplate);
  }

  submitFormTemplate() {
    if (this.form.valid) {
      console.log('Form Model submit:', this.model);
    }
    const formContentId = this.form.get('formContentId')?.value;
  }

  ngDoCheck(): void {
    if (this.fields){
      this.newFields = this.fields;
    }
  }

  deleteField(uniqueKey: string) {
    const fieldIndex = this.fields.findIndex(field => field.key === uniqueKey);

    if (fieldIndex !== -1) {
      const fieldId = this.fields[fieldIndex].id;  // Get the field ID
      const formTemplateId = this.formId;  // Get the form template ID
      this.fields.splice(fieldIndex, 1);

      this.form = this.fb.group({});

      this.fieldService.deleteFieldByIdAndUpdateFormTemplate(fieldId, formTemplateId)
        .subscribe(
          () => {
            console.log('Field deleted and form template updated');
          },
          error => {
            console.error('Error deleting field and updating form template:', error);
          }
        );
    }
  }

  submit() {
    if (this.form.valid) {
      const formValues = this.form.getRawValue();
      console.log('Form Values:', formValues);
    }
  }
}

