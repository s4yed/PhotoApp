import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { CameraService } from '../services/camera.service';
import { FirebaseService } from "../services/firebase.service";
import { OfflineManagerService } from "../services/offline-manager.service";
import { AuthService } from "../services/auth.service";
import { Image } from '../interfaces/image.interface';
import { ToastController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  user_images: Image[];
  constructor(
    private camera: CameraService,
    private fire: FirebaseService,
    private offline: OfflineManagerService,
    private auth: AuthService, 
    private alert: AlertController){
      this.imagesData();
      
    }
    
    img: Image = {
      name: 'sdjhfkjsdf.pnh',
      path: 'storage/emulated/0/Android/data/io.ionic.starter/cache/1506748631577.jpg',
      filePath: 'file:///storage/emulated/0/Android/data/io.ionic.starter/cache/1506748631577.jpg',
      date_time:{date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString()},
      user_id: this.auth.getUserId(),
      type: 'jpg'
    }
  ngOnInit(){
    this.fire.addImage(this.img);
    this.loadImage();
    this.imagesData();
    // this.fire.addImage(this.img);
    // console.log(this.auth.getUserId())
  }

  async loadImage(refresh = false, refresher?) {
    this.fire.getimages(refresh).subscribe(res => {

      

      this.user_images = res;
      if(refresher){
        refresher.target.complete()
      }
    });
  }

  getUserImages(){
    // for(let img of res){
    //   if(this.auth.getUserId() === img.user_id)
    //     this.user_images.push(img);
    // }
  }
  takePhoto(){
    this.camera.selectPhoto();
    this.imagesData();
    // return this.offline.storeRequest(image);
  }
  imagesData(){
    this.user_images = this.offline.getImages()
  }
  remove(item) {
    this.fire.removeImage(item.id);
  }
}
