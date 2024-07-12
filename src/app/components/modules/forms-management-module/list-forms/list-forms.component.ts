import { Component, OnInit, ViewChild } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormContentService } from '../../../../services/form-content.service';
import { forkJoin } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormCreationService } from '../../../../services/form-creation.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {FormSubmittedContentComponent} from '../../forms-submitted/form-submitted-content/form-submitted-content.component';
@Component({
  selector: 'app-list-forms',
  templateUrl: './list-forms.component.html',
  styleUrls: ['./list-forms.component.css'],
})
export class ListFormsComponent implements OnInit {
  allFormTemplateList = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'description', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private formcreation: FormCreationService,
    private route: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private formContent: FormContentService
  ) {}

  ngOnInit(): void {
    this.loadFormTemplates();
  }

  // tslint:disable-next-line:typedef
  loadFormTemplates() {
    this.formcreation.getAllFormTemplate().subscribe(
      res => {
        this.allFormTemplateList.data = res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.allFormTemplateList.paginator = this.paginator;
      },
      error => {
        console.log('No form template available');
      }
    );
  }

  // tslint:disable-next-line:typedef
  editForm(idForm: string) {
    localStorage.setItem('edit', JSON.stringify(true));
    this.route.navigate([`/admin/formsManagement/updateForm`, idForm]);
  }

  deleteForm(id: string): void {
    this.formcreation.deleteFormTemplateById(id).subscribe(() => {
      this.toastr.success('Deleted form successfully!');
      this.loadFormTemplates();
       });
  }

  // tslint:disable-next-line:typedef
  async openFomStructure(id) {
    try {
      const [formTemplateStructure] = await forkJoin([
        this.formContent.getFormTemplateById(id),
      ]).toPromise();

      console.log(formTemplateStructure);
      const dialogRef = this.dialog.open(FormSubmittedContentComponent, {
        width: '1000px', height: '1200px',
        data: { formStructure: formTemplateStructure, formModel: '' },
      });

      const customizationData = await dialogRef.afterClosed().toPromise();
      return customizationData;
    } catch (error) {
      console.error('Error in dialog:', error);
      return null;
    }
  }
  duplicateForm(form: any) {
    const duplicatedForm = { ...form, id: null, name: `${form.name} (Copy)` };
    this.formcreation.addFormTemplate(duplicatedForm).subscribe(
      (res) => {
        this.toastr.success('Duplicated form successfully!');
        this.loadFormTemplates();
      },
      (error) => {
        this.toastr.error('Failed to duplicate form');
      }
    );
  }
}
