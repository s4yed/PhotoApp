import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import {storage } from 'firebase';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  constructor(private toast: ToastController) { }

  async uploadImage(image_uri: string){
    const storage_rfe = await storage().ref();
    const pictures = storage_rfe.child('pictures');
    await pictures.putString(image_uri, 'image_uri').then((res) => {     
      this.toast.create({
        message: 'Uploaded',
      });
    }).catch((err) => {
      this.toast.create({
        message: 'Failed',
      });
    });
    let image_date = image_uri.split('/');
    await pictures.putString(image_date[image_date.length-1].split('.')[0], 'image_name').then((res) => {     
      this.toast.create({
        message: 'Uploaded',
      });
    }).catch((err) => {
      this.toast.create({
        message: 'Failed',
      });
    });;
    await pictures.putString(image_date[image_date.length-1].split('.')[1], 'image_type').then((res) => {     
      this.toast.create({
        message: 'Uploaded',
      });
    }).catch((err) => {
      this.toast.create({
        message: 'Failed',
      });
    });;
    await pictures.putString( '2BCNqj0OuvkEg1m8iZaO'    , 'user_id').then((res) => {     
      this.toast.create({
        message: 'Uploaded',
      });
    }).catch((err) => {
      this.toast.create({
        message: 'Failed',
      });
    });;
  }

}
