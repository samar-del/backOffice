import {Field} from './Field';
import {FormlyFieldConfig} from '@ngx-formly/core';

export class FormTemplate {
  title ?: string;
  description?: string;
  version?: number;
  fieldIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
