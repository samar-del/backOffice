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
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFormTemplates();
  }

  // tslint:disable-next-line:typedef
  loadFormTemplates() {
    this.formcreation.getAllFormTemplate().subscribe(
      (res) => {
        this.allFormTemplateList.data = res;
        this.allFormTemplateList.paginator = this.paginator;
      },
      (error) => {
        console.log('No form template available');
      }
    );
  }

  // tslint:disable-next-line:typedef
  editForm(idForm: string) {
    this.route.navigate([`home/forms/:`, idForm]);
  }

  deleteForm(id: string): void {
    this.formcreation.deleteFormTemplateById(id).subscribe(() => {
      this.toastr.success('Deleted form successfully!');
      this.loadFormTemplates();
       });
  }

  // tslint:disable-next-line:typedef
  navigateTo(id) {
    this.route.navigate([`/home/forms/form`, id]);
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
