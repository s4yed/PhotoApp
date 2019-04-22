import { Injectable } from '@angular/core';
import { File } from "@ionic-native/File/ngx";
import { OfflineManagerService } from './offline-manager.service';
import { ToastController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  constructor(private offline: OfflineManagerService,
    private file: File,
    private toast: ToastController,
    ) { }
    

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
  

  copyFileToLocalDir(namePath, currentName, newFileName) {
    ///this.presentToast("here");
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.presentToast(success.name)
      this.offline.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    }).catch(err => this.presentToast(err));
  }

  presentToast(msg: string) {
    this.toast.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    }).then(tost => tost.present());
  }

  
}


