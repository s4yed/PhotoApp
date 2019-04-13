import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { UploadImageService } from "./upload-image.service";
import { ToastController } from '@ionic/angular';

export interface User {
  id?: string;
  name: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  private dbColl: AngularFirestoreCollection<User>;
  names: Observable<User[]>;

  input : User = {
    name: "Ahmed"
  };

  constructor(db: AngularFirestore, private camera: Camera, private imgup: UploadImageService, private toast:ToastController ){
    this.dbColl = db.collection('names');
    this.names = this.dbColl.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  ngOnInit(){

  }
  addInput(){
    return this.dbColl.add(this.input);
  } 
  async takePhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
     this.camera.getPicture(options).then((imgData) => {
      let image = imgData;
      this.imgup.uploadImage(image).then((res) => {     
        this.toast.create({
          message: 'Uploaded',
        });
      }).catch((err) => {
        this.toast.create({
          message: 'Failed',
        });
      });;
    }, (err) => {
      this.toast.create({
        message: 'Failed',
      });
    });
  
  }
  upload(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imgData) => {
      let image = imgData;
      this.imgup.uploadImage(image).then((res) => {     
        this.toast.create({
          message: 'Uploaded',
        });
      }).catch((err) => {
        this.toast.create({
          message: 'Failed',
        });
      });;
    }, (err) => {
      this.toast.create({
        message: 'Failed',
      });
    });

  }
}
