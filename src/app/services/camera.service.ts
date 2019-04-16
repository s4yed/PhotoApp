import { Injectable } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
import { AlertController, ActionSheetController } from '@ionic/angular';
import { Image } from '../interfaces/image.interface';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private camera: Camera,
    private alertCtr: AlertController,
    private auth: AuthService,
    private actionSheet: ActionSheetController) { }

  async selectPhoto() {
    const actionSheet = await this.actionSheet.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      // if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      //   this.filePath.resolveNativePath(imagePath)
      //     .then(filePath => {
      //       let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
      //       let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
      //       this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      //     });
      // } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    });
  }

  // takePhoto(): Image {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     sourceType: this.camera.PictureSourceType.CAMERA,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   };

  //   let uri = '';
  //   this.camera.getPicture(options).then((imgData) => {
  //     uri = imgData;
  //   }, (err) => {
  //     this.alertCtr.create({
  //       header: "Camera Failed",
  //       message: "Unable to open the camera, plsease try again.",
  //       buttons: ["OK"]
  //     }).then(alert => alert.present());
  //   });
  //   return this.getPhotoData(uri);
  // }

  // uploadPhoto(): Image {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   };

  //   let uri;
  //   this.camera.getPicture(options).then((imgData) => {
  //     uri = imgData;
  //   }, (err) => {
  //     this.alertCtr.create({
  //       header: "Gallary Failed",
  //       message: "Unable to open the gallary, please try again.",
  //       buttons: ["OK"]
  //     }).then(alert => alert.present());
  //   });
  //   return this.getPhotoData(uri);
  // }

  private getPhotoData(uri: string): Image {
    let names = uri.split('/');
    let image: Image = {
      uri: uri,
      name: names[names.length - 1].split('.')[0],
      type: names[names.length - 1].split('.')[1],
      date_time: {
        date: new Date().toLocaleString().split(', ')[0],
        time: new Date().toLocaleString().split(', ')[1]
      },
      user_id: this.auth.getUserId()['uid']
    }
    return image;
  }
}
