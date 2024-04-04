import { Component, OnInit } from '@angular/core';
import {FormTemplate} from "../../models/FormTemplate";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {FormCreationService} from "../../services/form-creation.service";
import {FieldService} from "../../services/field.service";
import {TemplateOptionsService} from "../../services/template-options.service";
import {Field} from "../../models/Field";

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.css']
})
export class FormPreviewComponent implements OnInit {

  formTemplate: FormTemplate; // Assuming you have a FormTemplate model
  fields: FormlyFieldConfig[] = []; // Fields to be rendered in the form

  constructor(private formService: FormCreationService,
              private fieldService: FieldService,
              private templateOptionsService: TemplateOptionsService) { }

  ngOnInit(): void {
    // Assuming you have a method to fetch the form template based on its ID
    const formId = '6605716148ba450318128544'; // Example form ID
    this.formService.getFormTemplateById(formId).subscribe(
      (formTemplate: FormTemplate) => {
        this.formTemplate = formTemplate;
        this.fetchFields();
      },
      error => {
        console.error('Error fetching form template:', error);
      }
    );
  }

  fetchFields() {
    const fieldIds = this.formTemplate.fieldIds;
    const fieldsPromises = fieldIds.map(fieldId => this.fieldService.getFieldById(fieldId).toPromise());

    Promise.all(fieldsPromises).then(fields => {
      // Convert fetched fields to FormlyFieldConfig format
      this.fields = fields.map((field: Field) => {
        return this.mapFieldToFormlyFieldConfig(field);
      });
    }).catch(error => {
      console.error('Error fetching fields:', error);
    });
  }

  mapFieldToFormlyFieldConfig(field: Field): FormlyFieldConfig {
    // Implement logic to map your Field model to FormlyFieldConfig
    // Example implementation:
    return {
      key: field.key,
      type: field.type,
      templateOptions: {
        label: field.templateOptions.label,
        // Map other template options as needed
      }
    };
  }

}
