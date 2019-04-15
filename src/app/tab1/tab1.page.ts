import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { CameraService } from '../services/camera.service';


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

  input : Todo = {
    name: "Ahmed"
  };
  imageURI: string;

  constructor(private db: AngularFirestore,
     private camera: CameraService ){
    this.dbColl = this.db.collection('names');
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

  takePicture(){
    return this.camera.takePhoto();
  }

  uploadPhoto(){
    return this.camera.uploadPhoto();
  }
}
