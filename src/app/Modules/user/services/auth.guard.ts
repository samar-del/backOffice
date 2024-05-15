import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { SignupService } from './signup.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      /*if(this.service.IsLoggedIn()){
        return true;
      }else{
        this.router.navigate(['./login']);
        return false;
      }*/

    if (this.authService.isLoggedIn()){
      if(route.url.length>0){

        let menu = route.url[0].path;
        if(menu=='user-page'){

          if(this.service.GetUserRole()=='ADMIN'){
            return true;
          }else{
            this.toastr.warning('you dont have access');
            this.router.navigate(['/content'])
            return false;
          }

        }else{
          return true;
        }
      }else{
        return true;

      }

     } else{
      //move to login page
      this.router.navigate(['./login']);
      return false;
    }
  }

  constructor(private authService: AuthService, private router:Router, private toastr:ToastrService, private service: SignupService){

  }
}
