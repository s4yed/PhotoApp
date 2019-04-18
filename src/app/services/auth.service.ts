import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Storage } from '@ionic/storage';
import { LoadingController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { NetworkService } from './network.service';
import { User } from "../interfaces/user.interface";
var randomString = require('randomstring')

const USER_DATA = 'user-data';
const TOKEN_KEY = 'auth-token';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState = new BehaviorSubject(false);
  private uid: string = '';
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
      if(res.user){
        response = res.user.uid;
        this.uid = response;
      }
      this.setUserData(response)
      this.checkToken();
    }).catch(err => {
      console.log(err);
      response = err;
      load.dismiss();
    });
    return response;
  }

  logout(){
    this.storage.get(USER_DATA).then((data) => {
      let user_data = JSON.parse(data);
      this.storage.remove(USER_DATA).then(() => {
        this.authState.next(false);
        user_data.auth_state = false;
        console.log(user_data);
      });
    });
  }

  checkToken(){
    this.storage.get(USER_DATA).then((data) => {
      let user_data = JSON.parse(data);
      if(user_data){
        this.authState.next(true);
        this.uid = user_data.uid
        console.log(user_data);
      }
    });
  }
  
  setUserData(uid: string){
    let data: User = {
      uid: uid,
      auth_state: true,
      auth_token: randomString.generate(44)
    };
    this.storage.set(USER_DATA, JSON.stringify(data)).then((res) => {
      this.authState.next(true);
    });
  }

  isAuthenticated(){
    return this.authState.value;
  }
  
  getUserId(): any{
    /*let uid = '';
    this.storage.get(USER_DATA).then((data) => {
      let user_data = JSON.parse(data);
      if(user_data){
        return user_data.uid;
      }
    });*/
    console.log(this.uid);
    return this.uid;
  }
}
