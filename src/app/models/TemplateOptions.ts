import {Options} from './Options';

export class TemplateOptions {
  id?: string;
  label ?: string;
  disabled ?: boolean;
  maxlength ?: number;
  minlength ?: number;
  placeholder ?: string ;
  pattern ?: RegExp | string;
  options?: string[];
}
