import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { CameraService } from '../services/camera.service';
import { FirebaseService } from "../services/firebase.service";
import { OfflineManagerService } from "../services/offline-manager.service";
import { AuthService } from "../services/auth.service";
import { Image } from '../interfaces/image.interface';
import { ToastController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  // images: Image[];
  private imagesCollection: AngularFirestoreCollection<Image>;
  private images: Observable<Image[]>;
  constructor(
    private camera: CameraService,
    private fire: FirebaseService,
    private offline: OfflineManagerService,
    private auth: AuthService, 
    private alert: AlertController,
    db: AngularFirestore ){
     }

  ngOnInit(){
    this.fire.getImages().subscribe(res => {
      // this.images = res;
    });
  }

  async loadImage(refresh = false, refresher?) {
    this.fire.getImages(refresh).subscribe(res => {
      // this.images = res;
      if(refresher){
        refresher.target.complete()
      }
    });
  }

  takePhoto(){
    this.camera.selectPhoto();
    this.imagesData();
    // return this.offline.storeRequest(image);
  }
  imagesData(){
    this.fire.addImages().subscribe(res => {
      // this.images = res;
    });
  }

}
