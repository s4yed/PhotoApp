import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { Image } from "../interfaces/image.interface";
var randomString = require('randomstring')
import { FirebaseService } from './firebase.service';
 
const STORAGE_REQ_KEY = 'user_data';
 
@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
 
  constructor(private fire: FirebaseService, private storage: Storage, private toastController: ToastController) { }
 
  checkForEvents(): Observable<any> {
    return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
      switchMap(storedOperations => {
        let storedObj = JSON.parse(storedOperations);
        if (storedObj && storedObj.length > 0) {
          return this.sendRequests(storedObj).pipe(
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
 
  storeRequest(image: Image) {
    let toast = this.toastController.create({
      message: `Your data is stored locally because you seem to be offline.`,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());

 
    return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);
 
      if (storedObj) {
        storedObj.push(image);
      } else {
        storedObj = [image];
      }
      // Save old & new local transactions back to Storage
      return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    });
  }
 
  sendRequests(images: Image[]) {
    let obs = [];
 
    for (let img of images) {
      console.log('Make one request: ', img);
      let oneObs = this.fire.addImage(img);
      obs.push(oneObs);
    }
 
    // Send out all local events and return once they are finished
    return forkJoin(obs);
  }
}