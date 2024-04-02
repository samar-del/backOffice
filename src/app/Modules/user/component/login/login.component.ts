import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  email:string;
  password: string;
  errorMessage = 'invalid Credentials';
  successMEssage: string;
  invalidLogin = false;
  loginSuccess = false;



  constructor(private LoginService: LoginService , private router: Router){}



  handleLogin(){
    this.LoginService.signin(this.email, this.password).subscribe(
      (result)=> {
      this.invalidLogin = false;
      this.loginSuccess = true;
      this.successMEssage = 'login successsful';
      this.router.navigate(['/dashboard']);

    },
    (error)=>{
      this.invalidLogin = true;
      this.loginSuccess = false;
      console.error("Login failed:", error);
    }
    );

  }

}
