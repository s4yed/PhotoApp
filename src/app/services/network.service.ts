import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

export enum ConnectionStatus {
  Online,
  Offline
}
@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);
  
  constructor(private network: Network, private toast: ToastController, private plt: Platform) {
    this.plt.ready().then(() => {
      this.initializeNetworkEvent();
      let status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
    });
  }

  public initializeNetworkEvent() {
    this.network.onDisconnect().subscribe(() => {
      if(this.status.value === ConnectionStatus.Offline){
        console.log('WE ARE OFFLINE');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    }).unsubscribe();

    this.network.onConnect().subscribe(() => {
      if(this.status.value === ConnectionStatus.Online){
        console.log('WE ARE ONLINE');
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    }).unsubscribe();
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    let connection = status == ConnectionStatus.Offline ? 'Oflline' : 'Online';
    await this.toast.create({
      message: `You are now ${connection}`,
      duration: 3000,
      position: 'bottom'
    }).then(toast => toast.present());
  }

  public onNetworkChange(): Observable<ConnectionStatus>{
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): ConnectionStatus{
    return this.status.getValue();
  }
}
