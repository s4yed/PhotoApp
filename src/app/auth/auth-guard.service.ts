import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): boolean{
    if(!this.auth.isAuthenticated()){
      console.log('not active user');
      this.router.navigate(['login']);
      return false;
    }else{
      console.log('active user')
      return true;
    }
  }

}
