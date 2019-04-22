import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import{  ToastController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: FormGroup;

  error_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'pattern', message: 'Please enter a valid username.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'pattern', message: 'Password must contain numbers, uppercase and lo'}
    ]
  } 

  constructor(
    private router: Router,
    private auth: AuthService,
    public login: FormBuilder,
    private toastCtr: ToastController
    ) {

      this.user = this.login.group({
        username: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^(?=.*[a-z])[a-zA-Z0-9.-_!@#$&%]+$')
        ])],
        password: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^(?=.*[0-9])[a-zA-Z0-9]+$')
        ])]
      });
    }

  ngOnInit() {
  }

  onLogin(){
    this.auth.login(this.user.value.username, this.user.value.password).then((res) => {
      if(res.code){
        if(res.code === 'auth/network-request-failed')
          this.loginFailed('No internet connection.');
        else
          this.loginFailed('Invalid username or password.')
      }else{
        console.log('user-ID: ', res);
      }
    });

  }

  onSignup(){
    this.router.navigate(['/register'])
  }

  async loginFailed(message: string){
    const toast = await this.toastCtr.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    })
    await toast.present()
  }
}
