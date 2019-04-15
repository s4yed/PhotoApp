import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  constructor(private auth: AuthService, private router: Router){ }
  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
