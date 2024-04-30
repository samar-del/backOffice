import {Component, OnInit, ViewChild} from '@angular/core';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormContentService} from '../../services/form-content.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-list-forms',
  templateUrl: './list-forms.component.html',
  styleUrls: ['./list-forms.component.css']
})
export class ListFormsComponent implements OnInit {
  fields: FormlyFieldConfig[] = [];
  @ViewChild('formlyForm') formlyForm: any;
  form: FormGroup;
  model: any = {};
  options: FormlyFormOptions = {};
  constructor(private formContentService: FormContentService , private  fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
  }
  // tslint:disable-next-line:typedef
  getForm(){
    const formid = '662bb8c3a275290cb6b9317c';
    let fieldIds = [];
    this.formContentService.getFormTemplateById(formid).subscribe(res => {
      fieldIds = res.fieldIds;
      if (fieldIds.length === 0) {
        return; // No fields to process
      }

      const fieldObservables = fieldIds.map(el => this.formContentService.getFieldById(el));

      forkJoin(fieldObservables).subscribe(fields => {
        for ( let  i = 0; i < fields.length ; i++ ) {
          let optionsObservables = [];
          // tslint:disable-next-line:max-line-length
          if (fields[i].templateOptions.options != null){
            fields[i].templateOptions.disabled = false ;
            optionsObservables = fields[i].templateOptions.options.map(op => this.formContentService.getOptionsById(op));
            forkJoin(optionsObservables).subscribe(options => {
              const newFieldOptions = [];

              // Match fetched options with field's options
              fields[i].templateOptions.options.forEach((op) => {
                // @ts-ignore
                const matchedOption = options.find(opt => opt.id === op);
                if (matchedOption) {
                  newFieldOptions.push(matchedOption);
                }
              });
              // Assign the matched options to the field
              fields[i].templateOptions.options = newFieldOptions;
              this.options = fields[i].templateOptions.options;
              console.log(fields[i] , i);
              i++;
              //  this.formlyForm.resetForm({ model: this.newModel });
              // tslint:disable-next-line:no-shadowed-variable
            }, error => {
              console.log(error);
            });
          }
        }
        this.fields = fields;
        this.getFormContent(formid);
        // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(error);
      });
      // tslint:disable-next-line:no-shadowed-variable});
    });
  }
  // tslint:disable-next-line:typedef
  getFormContent(idForm: string) {
    this.formContentService.getFormContent(idForm).subscribe(res => {
      console.log(res);
      this.formContentService.getAnswers(res.formTemplateId).subscribe(
        success => {
          this.model = success.answers;
          this.form.patchValue(this.model);
        },
        error => {
          console.log('not found');
        }
      );
    },
      error => {
      console.log(error);
      });
  }

}
