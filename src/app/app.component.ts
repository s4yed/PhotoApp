import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { NetworkService} from './services/network.service';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit{

  isConnected: boolean

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
  ngOnInit(): void {
    console.log('[Home] OnInit');
    this.networkSubscriber();
}

networkSubscriber(): void {
    this.net
        .getCurrentNetworkStatus()
        .pipe(debounceTime(300))
        .subscribe((connected: boolean) => {
            this.isConnected = connected;
            console.log('[Home] isConnected', this.isConnected);
            //this.handleNotConnected(connected);
        });
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      //this.net.onNetworkChange().subscribe();
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
