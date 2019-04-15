import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Storage } from '@ionic/storage';
import { LoadingController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { NetworkService } from './network.service';
import { randomstring } from '../../../node_modules/randomstring'
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState = new BehaviorSubject(false);
  private token: string
  constructor(
    private afAuth: AngularFireAuth, 
    private storage: Storage,
    private loadingCtr: LoadingController,
    private plt: Platform,
    private net: NetworkService
    ) { 
      this.plt.ready().then(() => {
        this.checkToken();
      });
    }
    
  async login(user, pass){
    let load: HTMLIonLoadingElement;

    if(this.net.getCurrentNetworkStatus()){
      await this.loadingCtr.create({
        message: 'Please wait ...'
      }).then(res => {
        load = res;
        load.present();
      });
    }else {
      load.dismiss();
      return ;
    }
    
    let response;
    await this.afAuth.auth.signInWithEmailAndPassword(user + '@codedamn.com', pass).then(res => {
      load.dismiss();
      this.setToken();
      if(res.user){
        response = res.user.uid;
      }
    }).catch(err => {
      console.log(err);
      response = err;
      load.dismiss();
    });
    return response;
  }

  logout(){
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authState.next(false);
    });
  }

  checkToken(){
    this.storage.get(TOKEN_KEY).then((res) => {
      if(res){
        this.authState.next(true);
      }
      return res;
    });
  }
  
  setToken(){
    this.token = randomstring.generate();
    console.log(this.token);
    this.storage.set(TOKEN_KEY, this.token).then((res) => {
      console.log(res);
      this.authState.next(true);
    });
  }

  isAuthenticated(){
    return this.authState.value;
  }
  
}
