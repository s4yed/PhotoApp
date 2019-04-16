import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { CameraService } from '../services/camera.service';
import { FirebaseService } from "../services/firebase.service";
import { OfflineManagerService } from "../services/offline-manager.service";
import { AuthService } from "../services/auth.service";



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  imageURI: string;

  constructor(
    private camera: CameraService,
    private fire: FirebaseService,
    private offline: OfflineManagerService,
    private auth: AuthService ){ }

  ngOnInit(){

  }

  async loadImage(refresh = false, refresher?) {
    
  }

  takePhoto(){
    this.offline.storeRequest(this.camera.takePhoto());
  }

  uploadPhoto(){
    this.offline.storeRequest(this.camera.uploadPhoto());
  }
}
