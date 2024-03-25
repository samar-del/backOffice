import {Props} from './Props';
import {TemplateOptions} from './TemplateOptions';
import {FormlyTemplateOptions} from '@ngx-formly/core';

export class Field {
  id ?: string;
  key ?: string;
  templateOptions ?: TemplateOptions[];
  type ?: string;
}
