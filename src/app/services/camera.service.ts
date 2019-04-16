import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { AlertController } from '@ionic/angular';
import { Image } from '../interfaces/image.interface';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private camera: Camera,
    private alertCtr: AlertController,
    private auth: AuthService) { }

  takePhoto(): Image{
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
    return this.getPhotoData(uri);
  }
  
  uploadPhoto(): Image{
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
    return this.getPhotoData(uri);
  }

  private getPhotoData(uri: string): Image{
    let names = uri.split('/');
    let image: Image = {
      uri: uri,
      name: names[names.length - 1].split('.')[0],
      type: names[names.length - 1].split('.')[1],
      data: {
        size: 2,
        width: 600,
        height: 600
      },
      date_time: {
        date: new Date().toLocaleString().split(', ')[0], 
        time: new Date().toLocaleString().split(', ')[1]
      },
      user_id: this.auth.getUserId()['uid']
    }
    return image;
  }
}
