import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Storage } from '@ionic/storage';
import { Router } from "@angular/router";
import { LoadingController } from '@ionic/angular';
import * as randString from "../../../node_modules/randomstring";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token;

  constructor(
    private router:Router, 
    private afAuth: AngularFireAuth, 
    private storage: Storage,
    public loadingCtr: LoadingController
    ) { }

  async login(user, pass){
    let load: HTMLIonLoadingElement;

    this.loadingCtr.create({
      message: 'Please wait ...'
    }).then(res => {
      load = res;
      load.present();
    });

    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(user + '@codedamn.com',pass);
      load.dismiss();
      this.setToken();
      return res;
    } catch (error) {
      load.dismiss();
      console.log(error);
      return error;
    }

  }

  logout(){
    this.storage.clear();
    this.token = '';
    this.router.navigate(['/login']);
  }

  getToken(){
    if (this.token == 'undefined' || !this.storage.get('token')) {
      return null;
    }else{
      if (this.token) {
        return this.token;
      }else{
        this.storage.get('token').then(val => {
          this.token = val;
          
          return val;
        });
      }
    }
  }

  setToken(){
    this.token = randString.generate(40);
    this.storage.set('token',this.token);
  }

  isAuthenticated(){
    return this.getToken() ? true : false;
  }

}
