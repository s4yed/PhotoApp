// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { ToastController, Platform } from '@ionic/angular';
// import { Network } from '@ionic-native/network/ngx';

// export enum ConnectionStatus {
//   Online,
//   Offline
// }
// @Injectable({
//   providedIn: 'root'
// })
// export class NetworkService {
  
//   private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);
//   constructor(private network: Network, private toast: ToastController, private plt: Platform) {
//     this.plt.ready().then(() => {
//       this.initializeNetworkEvent();
//       let status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
//       this.status.next(status);
//     });
//   }

//   public initializeNetworkEvent() {
//     this.network.onConnect().subscribe(data => {
//       console.log(data)
//     }, error => console.error(error));
    
//     this.network.onDisconnect().subscribe(data => {
//       console.log(data)
//     }, error => console.error(error));

    
//     // this.network.onDisconnect().subscribe(() => {
//     //   if(this.status.getValue() === ConnectionStatus.Offline){
//     //     console.log('WE ARE OFFLINE');
//     //     this.updateNetworkStatus(ConnectionStatus.Offline);
//     //   }
//     // }).unsubscribe();

//     // this.network.onConnect().subscribe(() => {
//     //   if(this.status.getValue() === ConnectionStatus.Online){
//     //     console.log('WE ARE ONLINE');
//     //     this.updateNetworkStatus(ConnectionStatus.Online);
//     //   }
//     // }).unsubscribe();
//   }

//   private async updateNetworkStatus(status: ConnectionStatus) {
//     this.status.next(status);

//     let connection = status == ConnectionStatus.Offline ? 'Oflline' : 'Online';
//     let t = this.toast.create({
//       message: `You are now ${connection}`,
//       duration: 3000,
//       position: 'bottom'
//     });
//     t.then(toast => toast.present());
//   }

//   public onNetworkChange(): Observable<ConnectionStatus>{
//     return this.status.asObservable();
//   }

//   public getCurrentNetworkStatus(): ConnectionStatus{
//     return this.status.getValue();
//   }
// }

import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { fromEvent, merge, of, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable()
export class NetworkService {
    private online$: Observable<boolean> = undefined;

    constructor(public network: Network, public platform: Platform) {
        this.online$ = Observable.create(observer => {
            observer.next(true);
        }).pipe(mapTo(true));

        if (this.platform.is('cordova')) {
            // on Device
            this.online$ = merge(
                this.network.onConnect().pipe(mapTo(true)),
                this.network.onDisconnect().pipe(mapTo(false))
            );
        } else {
            // on Browser
            this.online$ = merge(
                of(navigator.onLine),
                fromEvent(window, 'online').pipe(mapTo(true)),
                fromEvent(window, 'offline').pipe(mapTo(false))
            );
            console.log(network.type);
        }
    }

    public getNetworkType(): string {
        return this.network.type;
    }

    public getCurrentNetworkStatus(): Observable<boolean> {
        return this.online$;
    }
}
