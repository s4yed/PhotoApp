import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import{ AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  username: string = ""
  password: string = ""
  cpassword: string = ""
  mismatch: boolean = false
  user: FormGroup

  error_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'pattern', message: 'Please enter a valid username.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'pattern', message: 'Password must contain numbers, uppercase and lo'}
    ],
    'cpassword':[
      { type: 'required', message: 'Congirmation Password is required.' },
    ]
  } 


  constructor(
    public afAuth: AngularFireAuth, 
    public alert: AlertController,
    public router: Router,
    public reg: FormBuilder
    ) { 
      this.user = this.reg.group({
        username: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^(?=.*[a-z])[a-zA-Z0-9.-_!@#$&%]+$')
        ])],
        password: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ])],
        cpassword: ['', Validators.compose([
          Validators.required,
        ])]
      });
    }

  ngOnInit() {
  }

  async register(){
    this.username = this.user.value.username
    this.password = this.user.value.password
    this.cpassword = this.user.value.cpassword
    const {username, password, cpassword} = this
    this.mismatch = false
    if(password !== cpassword){
      this.mismatch = true
    }
    else{
      try { 
        const res = await this.afAuth.auth.createUserWithEmailAndPassword(username + '@codedamn.com', password)
        console.log(res);
        this.router.navigate(['/tabs'])
      } catch(error){
        this.showAlert("error", error.message)
        console.dir(error);
      }
    }
  }

  async showAlert(header: string, message: string){
    const alert = await this.alert.create({
      header,
      message,
      buttons:["ok"]
    })
    await alert.present()
  }
}
