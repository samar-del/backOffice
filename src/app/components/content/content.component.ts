import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup} from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import {FormDialogComponent} from "../form-dialog/form-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {FormDialogCheckboxComponent} from "../form-dialog-checkbox/form-dialog-checkbox.component";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @Input() fields: FormlyFieldConfig[] = [];
  @ViewChild('formlyForm') formlyForm: any;
  form: FormGroup;
  model: any = {};
  options: FormlyFormOptions = {};

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.form = this.fb.group({});
  }

  onItemDropped(item: string) {
    this.addField(item);
  }

  // tslint:disable-next-line:typedef
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Transfer the item from the available items to the form
      const droppedItem = event.previousContainer.data[event.previousIndex];

      // Customize the dropped item (e.g., using a dialog)
      if (droppedItem === 'input') {
        this.addField('input');
      } else if (droppedItem === 'radio') {
        this.addField('radio');
      } else if (droppedItem === 'checkbox') {
        this.addField('checkbox');
      } else if (droppedItem === 'button') {
        this.addField('button');
      }

      // Transfer the item to the new container
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  // tslint:disable-next-line:typedef
  async addField(type: string) {
    const uniqueKey = `newInput_${this.fields.length + 1}`;
    // Customize other properties based on the type
    let newField: FormlyFieldConfig = {};
    if (type === 'Text') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        newField = {
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            type: 'text',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
          },
          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[uniqueKey];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength;
            },
          },
          // Customize other properties as needed
        };
      }
    }
    else if (type === 'Number') {
      const customizationData = await this.openInputDialog();
      // @ts-ignore
      if (customizationData) {
        newField = {
          type: 'input',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label,
            type: 'number',
            placeholder: customizationData.placeholder,
            minLength: customizationData.minLength,
            maxLength: customizationData.maxLength,
          },
          expressionProperties: {
            'templateOptions.errorState': (model: any, formState: any) => {
              // Check the length constraints and set error state accordingly
              const value = model[uniqueKey];
              const minLength = customizationData.minLength || 0;
              const maxLength = customizationData.maxLength || Infinity;
              return value.length < minLength || value.length > maxLength;
            },
          },
          // Customize other properties as needed
        };
      }
    }
    else if (type === 'checkbox') {
      const customizationData = await this.openCheckboxDialog().toPromise();
      if (customizationData) {
        newField = {
          type: 'checkbox',
          key: uniqueKey,
          templateOptions: {
            label: customizationData.label || 'New Checkbox Label'
          },
          defaultValue: false, // Add a default value for the checkbox
          // Customize other properties as needed
        };

        // Add the new field to the FormlyForm fields array
        this.fields.push(newField);

        // Update the form with the new fields
        this.form = this.fb.group({});
        this.formlyForm.resetForm({model: this.model});
      }

    }
    else if (type === 'button') {
      newField = {
        type: 'button',
        templateOptions: {
          text: 'Submit'
        }
        // Customize other properties as needed
      };
    }else {
      this.openRadioDialog();
    }

    if (newField) {
      // Add the new field to the FormlyForm fields array
      this.fields.push(newField);

      // Update the form with the new fields
      this.form = this.fb.group({});
      this.formlyForm.resetForm({ model: this.model });
    }
  }

  openCheckboxDialog(): Observable<any> {
    const dialogRef = this.dialog.open(FormDialogCheckboxComponent, {
      width: '1400px', // Adjust the width as needed
      data: {
        label: '' // Default label value
      }
    });

    return dialogRef.afterClosed();
  }

  // tslint:disable-next-line:typedef
  openRadioDialog() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Create the radio field group based on customization
        const newField: FormlyFieldConfig = {
          type: 'radio',
          key: 'newRadio',
          templateOptions: {
            label: result.radioLabel,
            options: result.options.map(option => ({ value: option, label: option }))
          }
        };

        // Add the new field to the FormlyForm fields array
        this.fields.push(newField);

        // Update the form with the new fields
        this.form = this.fb.group({});
        this.formlyForm.resetForm({ model: this.model });
      }
    });
  }

  // tslint:disable-next-line:typedef
  async openInputDialog() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1400px',
      data: {label: '', placeholder: ''},
    });
    try {
      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }

  submit() {
    if (this.form.valid) {
      const formValues = this.form.getRawValue(); // Extract raw form values
      console.log('Form Values:', formValues);
      // Handle form submission logic here (if needed)
    }
  }

  private getFieldType(item: string): string {
    // Define your logic to determine the type of Formly field based on the dropped item
    // For example, you can map specific items to certain types
    switch (item) {
      case 'input':
        return 'input';
      case 'checkbox':
        return 'checkbox';
      case 'button':
        return 'button';
      default:
        return 'input'; // Default to input type if not recognized
    }
  }

// tslint:disable-next-line:typedef
  deleteField(uniqueKey: string) {
    // Find the index of the field with the given unique key
    const fieldIndex = this.fields.findIndex(field => field.key === uniqueKey);

    // If the field is found, remove it from the fields array
    if (fieldIndex !== -1) {
      this.fields.splice(fieldIndex, 1);

      // Update the form with the new fields
      this.form = this.fb.group({});
      this.formlyForm.resetForm({ model: this.model, fields: this.fields });
    }
  }

  // tslint:disable-next-line:typedef
  openCustomizationDialog(uniqueKey: string) {
    const field = this.fields.find(f => f.key === uniqueKey);

    if (field) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        width: '1400px',
        data: {
          label: field.templateOptions.label,
          placeholder: field.templateOptions.placeholder,
          minLength: field.templateOptions.minLength,
          maxLength: field.templateOptions.maxLength,
          // Include other properties from the field's templateOptions as needed
        },
      });

      dialogRef.afterClosed().subscribe((newCustomizationData) => {
        if (newCustomizationData !== undefined) {
          this.updateCustomizationData(uniqueKey, newCustomizationData);
        }
      });
    }
  }


  // tslint:disable-next-line:typedef
  updateCustomizationData(uniqueKey: string, newCustomizationData: any) {
    // Find the field with the given unique key
    const field = this.fields.find(f => f.key === uniqueKey);

    // If the field is found, update its customization data
    if (field) {
      field.templateOptions = {
        ...field.templateOptions,
        ...newCustomizationData,
      };

      // Update the form with the new fields
      this.form = this.fb.group({});
      this.formlyForm.resetForm({ model: this.model, fields: this.fields });
    }
  }


  ngOnInit(): void {
  }
}
