import { Component, OnInit } from '@angular/core';
import { ProtectedService } from '../../user/services/protected.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  constructor(private protectedServiec: ProtectedService) {
// we will intercept each request and append httpHeader with accesstoken in each request, with the help of interceptor
  }

  ngOnInit(): void {
   /* this.protectedServiec.getUserData().subscribe({

      next: (res)=>{
        console.log(res);
      },
      error:(err)=>{
        console.log(err);
      }
    })*/
  }

}
