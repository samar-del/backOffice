import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserService } from '../../user/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  updateUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.updateUserForm = this.fb.group({
      userName: [data.userName],
      password: [''],
      email: [data.email]
    });
  }

  ngOnInit(): void {}

 
}
