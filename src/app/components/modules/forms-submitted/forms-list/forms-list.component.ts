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

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.css']
})
export class FormsListComponent implements OnInit {
  allFormTemplateList = new MatTableDataSource<any>();
  displayedColumns: string[] = ['title', 'description', 'userId' , 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private formContent: FormContentService, private dialog: MatDialog) { }

  ngOnInit(): void {
    const answersList = [];
    this.formContent.getAllAnswers().subscribe(formSubmittedList => {
      formSubmittedList.forEach(el => {
        if (el.userId != null){
          const formSubmitted = new FormSubmitted();
          formSubmitted.formTemplateId = el.formTemplateId ;
          formSubmitted.userId = el.userId;
          formSubmitted.answerId = el.id ;
          answersList.push(formSubmitted);
        }
      });
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

}
