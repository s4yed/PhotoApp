import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Storage } from '@ionic/storage';
import { Router } from "@angular/router";
import { LoadingController, Platform } from '@ionic/angular';
import * as randString from "../../../node_modules/randomstring";
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState = new BehaviorSubject(false);

  constructor(
    private router:Router, 
    private afAuth: AngularFireAuth, 
    private storage: Storage,
    private loadingCtr: LoadingController,
    private plt: Platform
    ) { 
      this.plt.ready().then(() => {
        this.getToken();
      });
    }

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
      this.authState.next(true);
      return res;
    } catch (error) {
      load.dismiss();
      console.log(error);
      return error;
    }

  }

  logout(){
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authState.next(false);
    });;
    this.router.navigate(['/login']);
  }

  getToken(){
    return this.storage.get(TOKEN_KEY).then((res) => {
      if(res){
        this.authState.next(true);
      }
    });
  }

  setToken(){
    let token = randString.generate(50);
    this.storage.set(TOKEN_KEY, token);
  }

  isAuthenticated(){
    return this.authState.value;
  }

}
