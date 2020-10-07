import { Injectable } from '@angular/core';
import { Session } from 'inspector';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  private localStorageService;
  private currentSession: Session = null;

  constructor(private router: Router) {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }

  loadSessionData(): Session {
    var sessionStr = this.localStorageService.getItem('currentUser');
    return (sessionStr) ? <Session>JSON.parse(sessionStr) : null;
  }

  removeCurrentSession(): void {
    this.localStorageService.removeItem('currentUser');
    this.currentSession = null;
  }

  isAuthenticated(): boolean {
    return (this.getCurrentToken() != null) ? true : false;
  };

  getCurrentToken(): string {
    let token = localStorage.getItem("ACCESS_TOKEN");
    return (token) ? token : null;
  };

  logout(): void {
    this.removeCurrentSession();
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
    this.router.navigate(['/login']);
  }
}
