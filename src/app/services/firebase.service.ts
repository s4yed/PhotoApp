import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Image } from '../interfaces/image.interface';
import { NetworkService } from "../services/network.service";
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { OfflineManagerService } from './offline-manager.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private imagesCollection: AngularFirestoreCollection<Image>;
 
  private images: Observable<Image[]>;
 
  constructor(private db: AngularFirestore,
    private net: NetworkService,
    // private offline: OfflineManagerService,
    private storage: Storage) {
    this.initcollection();
  }

  initcollection(){
    this.imagesCollection = this.db.collection<Image>('images');
 
    this.images = this.imagesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
 
  getImages(forceRefresh: boolean = false): Observable<Image[]> {
    if (!this.net.getCurrentNetworkStatus()) {
      this.images = from(this.getLocalData('user_data'));
      return this.images;
    }else{
      return from(this.setLocalData('user_data', JSON.stringify(this.images)));
    }
  }
 
  getImage(id) {
    return this.imagesCollection.doc<Image>(id).valueChanges();
  }
 
  updateImage(image: Image, id: string) {
    return this.imagesCollection.doc(id).update(image);
  }
 
  addImage(image: Image) {
    return this.imagesCollection.add(image);
  }

  addImages() {
    return this.images;
  }
  removeImage(id) {
    return this.imagesCollection.doc(id).delete();
  }
  
  setLocalData(key, data){
    return this.storage.set(key, data);
  }
  getLocalData(key){
    return this.storage.get(key);
  }
}
