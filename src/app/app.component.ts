import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { NetworkService, ConnectionStatus } from './services/network.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService,
    private router: Router,
    private net: NetworkService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.net.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if(status === ConnectionStatus.Online)
          console.log(ConnectionStatus.Offline);
      });
      this.auth.authState.subscribe(state => {
        console.log(state);
        if(state){
          this.router.navigate(['tabs/tab1']);
        }else{
          this.router.navigate(['login']);
        }
      });
      
    });
  }
}
