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
  storageType?: string;
  dataSourceType?: 'values' | 'url' | 'resources' | 'json';
  allowOnlyAvailableValues?:boolean;
}
