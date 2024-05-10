import {Options} from './Options';

export class TemplateOptions {
  id?: string;
  label ?: string;
  disabled ?: boolean;
  maxlength ?: number;
  minlength ?: number;
  placeholder_fr ?: string ;
  placeholder_ar ?: string ;
  pattern ?: RegExp | string;
  multiple ?: boolean;
  type ?: string;
  options?: string[];
  required?: boolean;
  hidden?: boolean;
  hide_label_fr ?: boolean;
  hide_label_ar ?: boolean;
  custom_css?: string;
  field_tags ?: string[];
  property_name ?:string;
  error_label ?: string;
  custom_error_message ?: string;
  number_rows ?: string;
  number_columns ?: string;
  theme ?: string;
  collapsible?: string;
  langue ?: string;
  label_fr ?: string;
  label_ar ?: string;

}
