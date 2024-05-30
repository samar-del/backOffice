import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {FieldType} from '@ngx-formly/core';

@Component({
  selector: 'app-formly-field-file',
  template: `
    <input type="file" class="file-input"  [formControl]="formControl" [formlyAttributes]="field">
  `,
  styleUrls: ['./formly-field-file.component.css']
})
export class FormlyFieldFileComponent extends FieldType {

  constructor(private http: HttpClient) {
    super();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.http.post('/api/upload', formData).subscribe(
      (response) => {
        console.log('File uploaded successfully', response);
      },
      (error) => {
        console.error('Error uploading file', error);
      }
    );
  }

}
