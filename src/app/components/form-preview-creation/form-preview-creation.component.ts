import {ChangeDetectorRef, Component, DoCheck, Input, OnInit, ViewChild} from '@angular/core';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ShareService} from '../../services/share.service';
import {any} from 'codelyzer/util/function';

@Component({
  selector: 'app-form-preview-creation',
  templateUrl: './form-preview-creation.component.html',
  styleUrls: ['./form-preview-creation.component.css']
})
export class FormPreviewCreationComponent implements DoCheck {
  previewfields: FormlyFieldConfig[] = [];
  previewForm: FormGroup;
  previewModel: any = {};
  previousPreviewFields: FormlyFieldConfig[] = [] ;
  previousPreviewModel: any = {};
  options: FormlyFormOptions = {};
  @Input() field: FormlyFieldConfig[] = [];
  @ViewChild('formlyForm') formlyForm: any;
  constructor(private fb: FormBuilder, private shareService: ShareService, private cdRef: ChangeDetectorRef) {
    this.previewForm = this.fb.group({});
  }
  ngDoCheck(): void {
    // this.previewfields.forEach(field => {
    //   const formControlName = field.key ;
    //   this.previewForm = this.fb.group({
    //     formControlName: [field.model],
    //   });
    // });

    this.shareService.fieldsPreviewList$.subscribe(data => {
      this.previewfields = data;
    });
    this.previewfields.forEach(el => console.log(el.model));
    // if (this.arePreviewFieldsChanged()) {
    //   console.log('this.previewmodel', this.previewModel);
    //   this.updatePreviewFields();
    // }
    if (this.previewfields != null){
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.previewfields.length; i++) {
        const fieldTochek = this.previewfields.find(el => el.key === this.previewfields[i].templateOptions.condi_whenShouldDisplay);
        // @ts-ignore
        if (fieldTochek){
          console.log('typeof fieldTochek.model', typeof fieldTochek.model.key);
          const nomValue = fieldTochek.model[this.previewfields[i].templateOptions.condi_whenShouldDisplay];
          console.log(nomValue);
          if (nomValue === this.previewfields[i].templateOptions.condi_value)  {
          this.updatePreviewFields(this.previewfields[i].key.toString());
          return  console.log('equal', fieldTochek , this.previewModel[this.previewfields[i].key.toString()]);
        }
          console.log('fieldTochek', fieldTochek);
      }
      }}
    // test pour list des conditions
    if (this.previewfields != null){
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.previewfields.length; i++) {
        const fieldTochek = this.previewfields.find(el => el.key === this.previewfields[i].templateOptions.condi_whenShouldDisplay);
        // @ts-ignore
        if (fieldTochek){
          console.log('typeof fieldTochek.model', typeof fieldTochek.model.key);
          const nomValue = fieldTochek.model[this.previewfields[i].templateOptions.condi_whenShouldDisplay];
          console.log(nomValue);
          if (nomValue === this.previewfields[i].templateOptions.condi_value)  {
            this.updatePreviewFields(this.previewfields[i].key.toString());
            return  console.log('equal', fieldTochek , this.previewModel[this.previewfields[i].key.toString()]);
          }
          console.log('fieldTochek', fieldTochek);
        }
      }}
  }
  updatePreviewFields(key: string) {
      const fieldToUpdate = this.previewfields.find(el => el.key.toString() === key);
      if (fieldToUpdate){
        fieldToUpdate.templateOptions.hidden = false;
      }
      // fieldToUpdate.templateOptions.change;
      console.log(fieldToUpdate);
      this.cdRef.detectChanges();
      this.previewForm = this.fb.group({});
  }
  arePreviewFieldsChanged(): boolean {
    if (this.field.length !== this.previewfields.length) {
      return true;
    }
    this.previousPreviewFields = {...this.field};
    if (this.previewfields != null){
      // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.previewfields.length; i++) {
      const fieldTochek = this.previewfields.find(el => el.key === this.previewfields[i].templateOptions.condi_whenShouldDisplay && el.model === this.previewfields[i].templateOptions.condi_value);
      // if (JSON.stringify(this.previewfields[i].model) !== JSON.stringify(this.previousPreviewFields[i].model)) {
      console.log('fieldTochek', fieldTochek);
      if (fieldTochek) {
        return true;
      }
    }}
    return false;
    console.log('this.previewfields.values()', this.previewfields.values());
    console.log('this.previewmodel', this.previewModel);
     }
}
