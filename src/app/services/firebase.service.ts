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
 
  constructor(db: AngularFirestore) {
    this.imagesCollection = db.collection<Image>('images');
 
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
 
  getimages(refresh = false) {
    return this.images;
  }
 
  getImage(id) {
    return this.imagesCollection.doc<Image>(id).valueChanges();
  }
 
  updateImage(image: Image, id: string) {
    return this.imagesCollection.doc(id).update(Image);
  }
 
  addImage(Image: Image) {
    return this.imagesCollection.add(Image);
  }
 
  removeImage(id) {
    return this.imagesCollection.doc(id).delete();
  }
}
