import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {filter, map, mergeMap, toArray} from 'rxjs/operators';
import {forkJoin, from} from 'rxjs';
import {FormSubmitted} from '../../../../models/formSubmitted';
import {FormContentService} from '../../../../services/form-content.service';
import {MatPaginator} from '@angular/material/paginator';
import {IFrameDialogComponent} from '../../../fields-dialog/i-frame-dialog/i-frame-dialog.component';
import {FormSubmittedContentComponent} from '../form-submitted-content/form-submitted-content.component';
import {MatDialog} from '@angular/material/dialog';
import {Notification} from '../../../../models/notification';
import {AuthService} from '../../../../Modules/user/services/auth.service';
import {ValidationDialogComponent} from '../dialog/validation-dialog/validation-dialog.component';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.css']
})
export class FormsListComponent implements OnInit {
  allFormTemplateList = new MatTableDataSource<any>();
  currentUseId: string;
  displayedColumns: string[] = ['title', 'description', 'userId' , 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private formContent: FormContentService, private dialog: MatDialog, private authService: AuthService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.authService.getUserId().subscribe(res => {
      this.currentUseId = res;
    }, err => {
      console.log('user id is null');
    });

    const answersList = [];
    this.formContent.getAllAnswers().pipe(
      mergeMap(formSubmittedList => {
        const formTemplateRequests = formSubmittedList
          .filter(el => el.userId != null)
          .map(el => {
            const formSubmitted = new FormSubmitted();
            formSubmitted.formTemplateId = el.formTemplateId;
            formSubmitted.userId = el.userId;
            formSubmitted.answerId = el.id;
            return this.formContent.getFormTemplateById(el.formTemplateId).pipe(
              map(template => {
               if (template) {
                formSubmitted.title = template.title;
                formSubmitted.description = template.description;
              } else {
                formSubmitted.title = 'Unknown Title';
                formSubmitted.description = 'No Description Available';
              }
              return formSubmitted;
              })
            );
          });
        return forkJoin(formTemplateRequests);
      })
    ).subscribe(answersList => {
      this.allFormTemplateList.data = answersList;
      this.allFormTemplateList.paginator = this.paginator;
    });
  }

  async viewContent(idAnswer: string , idFormTemplate: string){
    try {
      const [formTemplateStructure, answer] = await forkJoin([
        this.formContent.getFormTemplateById(idFormTemplate),
        this.formContent.getAnswersById(idAnswer)
      ]).toPromise();

      console.log(formTemplateStructure);
      console.log(answer);

      const dialogRef = this.dialog.open(FormSubmittedContentComponent, {
        width: '1400px',
        data: { formStructure: formTemplateStructure, formModel: answer },
      });

      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }

  async validateForm(form: any, validation: string) {
    let Description = '';
    let notifToastr = '' ;
    if (validation === 'validate'){
      Description = 'La formulaire dont le titre est ' + form.title + ' que vous aver soumis a été validé par l administrateur ';
      notifToastr = ' Validation faite avec succes';
    }else {
      Description = 'La formulaire dont le titre est ' + form.title + ' que vous aver soumis n a pas été validé par l administrateur ';
      notifToastr = 'Dévalidation faite avec succes';
    }
    try {
      const notif: Notification = new  Notification();
      notif.id = null;
      notif.answersId = form.answerId;
      notif.idUserToInform = form.userId;
      notif.idAdmin = this.currentUseId;
      notif.title = form.title;
      notif.description = Description;
      const dialogRef = this.dialog.open(ValidationDialogComponent, {
        width : '400px',
        data: { notificationInfo: notif, typeValidation: validation }
      });
      const customizationData = await dialogRef.afterClosed().toPromise();
      console.log('Customization Data:', customizationData);
      if (customizationData === true) {
        this.toastr.success(notifToastr);
      } else if (customizationData === false) {
        this.toastr.info('Validation failed.');
      } else {
        this.toastr.info('Operation cancelled or encountered an issue.');
      }

      return customizationData;
    }
  catch (error){
      console.log('error');
  }
  }

  deleteForm(answerId: string ){
    this.formContent.deleteForm(answerId).subscribe(()=>{
      this.toastr.success('Form deleted successfully');

    })

  }
}
