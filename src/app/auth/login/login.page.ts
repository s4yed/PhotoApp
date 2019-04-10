import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from '@angular/router';
import{ AlertController } from '@ionic/angular';
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
    private alert: AlertController,
    public login: FormBuilder
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
        this.loginFailed()
      }else{
        this.router.navigate(['/tabs/tab1']);
      }
    });

  }

  onSignup(){
    this.router.navigate(['/register'])
  }

  async loginFailed(){
    const alert = await this.alert.create({
      header: 'Login Failed',
      message: 'Invalid username or password, please try again.',
      buttons:["ok"]
    })
    await alert.present()
  }
}
