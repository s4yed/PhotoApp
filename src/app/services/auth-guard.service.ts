import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from "./auth.service";
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private alertCtr: AlertController) { }

  canActivate(): boolean{
    return this.auth.isAuthenticated();
  }

}
