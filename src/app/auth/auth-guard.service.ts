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
    if(this.auth.isAuthenticated())
      return true;
    else{
      this.alertCtr.create({
        header: "Sorry !",
        message: "You should be able to login to enter this page.",
        buttons: ['OK']
      }).then(alert => alert.present());
      return false;
    }

  }

}
