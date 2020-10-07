import { Component } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Router } from '@angular/router';
import { LocalstorageService } from './services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;

  logeado = false;

  constructor(private route: Router, private storage: LocalstorageService) {
  }

  redirect() {
    this.route.navigateByUrl('/login');
  }

  checkLogin() {
    if (this.storage.isAuthenticated()) {
      this.logeado = true
      return true;
    }
    this.logeado = false
    return false;
  }

  logout() {
    this.storage.logout();
  }
}
