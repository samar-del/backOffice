import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormContentService} from '../../../../../services/form-content.service';
import {GestionPermissionComponent} from '../../../permession-management-module/PermissionPage/gestion-permission.component';
import {FormsListComponent} from '../../forms-list/forms-list.component';

@Component({
  selector: 'app-validation-dialog',
  templateUrl: './validation-dialog.component.html',
  styleUrls: ['./validation-dialog.component.css']
})
export class ValidationDialogComponent implements OnInit {
 descriptionNotif: string;
 validationStatus: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formContentService: FormContentService,
              private dialogRef: MatDialogRef<FormsListComponent>) { }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.typeValidation === 'validate'){
     this.descriptionNotif = 'Etes vous sure de confirmer la validation des données ?' ;
     this.validationStatus = true;
   } else {
     this.descriptionNotif = 'Etes vous sur de confirmer invalidation des données ?' ;
     this.validationStatus = false;
   }
  }
  validateTask(): void {
    const requestBody = {
      notificationRequest: this.data.notificationInfo,
      validationStatus: this.validationStatus
    };

    this.formContentService.validateAnswers(requestBody.notificationRequest, requestBody.validationStatus).subscribe(
      (res) => {
        console.log('Validation successful:', res);
        this.dialogRef.close(true); // Close dialog with true if validation successful
      },
      (err) => {
        console.error('Error during validation:', err);
        this.dialogRef.close(false); // Close dialog with false if validation failed
      }
    );
  }

  cancelDialog(){
    this.dialogRef.close(null);
  }
}
