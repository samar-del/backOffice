import {Options} from './Options';

export class TemplateOptions{
  label ?: string;
  disabled ?: boolean;
  maxlength ?: number;
  minlength ?: number;
  placeholder ?: string ;
  pattern ?: RegExp | string;
  options?: Options[];
}
