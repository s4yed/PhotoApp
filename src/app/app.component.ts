import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { NetworkService} from './services/network.service';
import { debounceTime } from 'rxjs/operators';
import { FirebaseService } from './services/firebase.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {

   isConnected: boolean

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService,
    private router: Router,
    private net: NetworkService,
    private fire: FirebaseService
  ) {
    this.initializeApp();
  }
  
  networkSubscriber(): void {
    this.net
    .getCurrentNetworkStatus()
        .pipe(debounceTime(2000))
        .subscribe((connected: boolean) => {
            console.log('[Home] isConnected', connected);
            this.net.updateNetworkChanges(connected)
          });
          
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      // this.fire.initcollection();
      // this.net.onNetworkChange().subscribe();
      this.networkSubscriber();
      this.auth.authState.subscribe(state => {
        console.log('auth-state: ', state)
        if(state){
          this.router.navigate(['tabs/tab1']);
        }else{
          this.router.navigate(['login']);
        }
      });
      
    });
  }
}
