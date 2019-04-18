import { Injectable} from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { ToastController, AlertController, Platform } from '@ionic/angular';
import { Image } from "../interfaces/image.interface";
var randomString = require('randomstring')
import { FirebaseService } from './firebase.service';
import { CameraService } from './camera.service'
import { AuthService } from './auth.service';
import { File } from "@ionic-native/File/ngx";
import { WebView } from '@ionic-native/ionic-webview/ngx';
const STORAGE_REQ_KEY = 'user_data';

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {

  images: Image[];
  constructor(private fire: FirebaseService,
    private storage: Storage,
    private alert: AlertController,
    private toastController: ToastController,
    private plt: Platform,
    // private camera: CameraService,

    private auth: AuthService,
    private file: File,
    private webview: WebView,
    //private ref: ChangeDetectorRef
  ) {
    this.plt.ready().then(() => {
      this.loadStoredImages();
      this.checkForEvents();
    });
  }


    checkForEvents(): Observable<any> {
    return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
      switchMap(storedOperations => {
        let storedObj = JSON.parse(storedOperations);
        if (storedObj && storedObj.length > 0) {
          return of(this.fire.addImage(storedObj)).pipe(
            finalize(() => {
              let toast = this.toastController.create({
                message: `Local data succesfully synced to API!`,
                duration: 3000,
                position: 'bottom'
              });
              toast.then(toast => toast.present());

              this.storage.remove(STORAGE_REQ_KEY);
            })
          );
        } else {
          console.log('no local events to sync');
          return of(false);
        }
      })
    )
  }
  loadStoredImages() {
    this.storage.get(STORAGE_REQ_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          this.images.push(img);
          this.fire.addImage(img);
        }
      }
    });
  }
  
  
  updateStoredImages(name) {
    this.alert.create({
      message: JSON.stringify( this.images),
      buttons: ['OK']
    }).then(res => res.present());
    
    let filePath = this.getDataDir() + name;
    let resPath = this.pathForImage(filePath);
    this.storage.get(STORAGE_REQ_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let image: Image = {
          name: name,
          path: resPath,
          filePath: filePath,
          type: 'jpg',
          date_time: { date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() },
          user_id: this.auth.getUserId()
        };
        this.storage.set(STORAGE_REQ_KEY, JSON.stringify(image));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_REQ_KEY, JSON.stringify(arr));
      }
    }).catch(err => this.toastController.create({
      message: err,
      duration: 5000,
      position: 'middle'
    }));
    
    let image: Image = {
      name: name,
      path: resPath,
      filePath: filePath,
      type: 'jpg',
      date_time: { date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() },
      user_id: this.auth.getUserId()
    };
    
    this.images = [image, ...this.images];
    //this.ref.detectChanges(); // trigger change detection cycle
  }

  getDataDir(){
    return this.file.dataDirectory;
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  getImages(): Image[] {
    return this.images;
  }

  deleteImage(image, position) {
    this.images.splice(position, 1);

    this.storage.get(STORAGE_REQ_KEY).then(images => {
      let arr = JSON.parse(images);
      let filtered = arr.filter(name => name != image.name);
      this.storage.set(STORAGE_REQ_KEY, JSON.stringify(filtered));

      var correctPath = image.filePath.substr(0, image.filePath.lastIndexOf('/') + 1);

      this.file.removeFile(correctPath, image.name).then(res => {
        this.toastController.create({
          message: 'file removed',
          duration: 2000,
          position: 'bottom'
        });
      });
    });
  }

}