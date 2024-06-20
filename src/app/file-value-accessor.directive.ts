import {Directive, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const FILE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FileValueAccessorDirective),
  multi: true
};
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'input[type=file]' ,
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '(change)': 'onChange($event.target.files)',
    '(blur)': 'onTouched()'
  },
  providers: [FILE_VALUE_ACCESSOR]
})
export class FileValueAccessorDirective implements  ControlValueAccessor{

  value: any;
  onChange = (_: any) => {};
  onTouched = () => {};

  // tslint:disable-next-line:typedef
  writeValue(_value: any) {}
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

}
