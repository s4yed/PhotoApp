import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";


export interface Todo {
  id?: string;
  name: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  private dbColl: AngularFirestoreCollection<Todo>;
  names: Observable<Todo[]>;
  base64: String;
  input : Todo = {
    name: "Ahmed"
  };

  constructor(private db: AngularFirestore,public camera: Camera){
    this.dbColl = db.collection('names');
    this.names = this.dbColl.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  ngOnInit(){

  }
  addInput(){
    return this.dbColl.add(this.input);
  }

  uploadPhoto(){
    const options : CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.base64 = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });

  }



}
