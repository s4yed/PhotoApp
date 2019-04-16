import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { CameraService } from '../services/camera.service';
import { FirebaseService } from "../services/firebase.service";
import { OfflineManagerService } from "../services/offline-manager.service";
import { AuthService } from "../services/auth.service";
import { Image } from '../interfaces/image.interface';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  images: Image[];

  constructor(
    private camera: CameraService,
    private fire: FirebaseService,
    private offline: OfflineManagerService,
    private auth: AuthService ){ }

  ngOnInit(){

  }

  async loadImage(refresh = false, refresher?) {
    this.fire.getImages(refresh).subscribe(res => {
      this.images = res;
      if(refresher){
        refresher.target.complete()
      }
    });
  }

  takePhoto(){
    this.camera.selectPhoto();
    // return this.offline.storeRequest(image);
  }
}
