import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Image } from '../interfaces/image.interface';
import { map } from 'rxjs/operators';

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
 
  getImages(forceRefresh: boolean = false) {
    return this.images;
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
 
  removeImage(id) {
    return this.imagesCollection.doc(id).delete();
  }
}
