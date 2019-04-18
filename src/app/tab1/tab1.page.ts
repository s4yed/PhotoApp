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
  user_images: any;
  offlin_users: Image[]
  image : boolean = true
  uid: string;
  constructor(
    private camera: CameraService,
    private fire: FirebaseService,
    private offline: OfflineManagerService,
    private auth: AuthService, 
    private alert: AlertController){
      //this.imagesData();
      //this.loadImage();
      this.uid = this.auth.getUserId()
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
      this.loadImage();
      //this.user_images.pipe(map(res))
      //this.user_images = this.loadImage();
      //this.imagesData();
    //this.fire.addImage(this.img);
  }

  async loadImage() {
    this.fire.getimages().subscribe(res => {
      this.user_images = res;
    });
    //console.log(this.user_images)
  }


  takePhoto(){
    this.camera.selectPhoto();
    this.imagesData();
    // return this.offline.storeRequest(image);
  }
  imagesData(){
    this.offlin_users = this.offline.getImages()
  }
  remove(item) {
    
    this.fire.removeImage(item.id);
  }
}
