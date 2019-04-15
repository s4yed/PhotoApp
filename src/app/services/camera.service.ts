import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private camera: Camera, private alertCtr: AlertController) { }

  takePhoto(): string{
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    let uri = '';
    this.camera.getPicture(options).then((imgData) => {
      uri = imgData;
    }, (err) => {
      this.alertCtr.create({
        header: "Camera Failed",
        message: "Unable to open the camera, plsease try again.",
        buttons: ["OK"]
      }).then(alert => alert.present());
    });
    return uri;
  }
  
  uploadPhoto(): string{
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    let uri;
    this.camera.getPicture(options).then((imgData) => {
      uri = imgData;
    }, (err) => {
      this.alertCtr.create({
        header: "Gallary Failed",
        message: "Unable to open the gallary, please try again.",
        buttons: ["OK"]
      }).then(alert => alert.present());
    });
    return uri;
  }
}
