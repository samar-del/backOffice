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
    if (this.data.typeValidateion === 'validate'){
     this.descriptionNotif = 'Etes vous sur de confirmer la validation des données ?' ;
     this.validationStatus = true;
   } else {
     this.descriptionNotif = 'Etes vous sur de confirmer la dévalidation des données ?' ;
     this.validationStatus = false;
   }
  }
  validateTask(){
    this.formContentService.validateAnswers(this.data.notificationInfo,this.validationStatus).subscribe(res => {
      return res;
      this.dialogRef.close();
    }, err => {
      return null;
    });
  }
  cancelDialog(){
    this.dialogRef.close();
  }
}
