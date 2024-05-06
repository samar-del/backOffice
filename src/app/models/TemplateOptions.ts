import {Options} from './Options';

export class TemplateOptions {
  id?: string;
  label ?: string;
  disabled ?: boolean;
  maxlength ?: number;
  minlength ?: number;
  placeholder ?: string ;
  pattern ?: RegExp | string;
  multiple ?: boolean;
  type ?: string;
  options?: string[];
  required?: boolean;
  hidden?: boolean;
  hide_label?: boolean;
  custom_css?: string;
  field_tags ?: string[];
  property_name ?:string;
  error_label ?: string;
  custom_error_message ?: string;
  rows ?: number;
  columns ?: number;
  theme ?: string;
  collapsible?: string;
}
