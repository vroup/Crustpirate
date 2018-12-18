import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  storageKey = 'foobar-jwt';

  constructor(private router: Router) { }

  SetToken(token: string): void {
    localStorage.setItem(this.storageKey, token);
  }

  GetToken(): string {
    return localStorage.getItem(this.storageKey);
  }

  IsLoggedIn(): boolean {
    return this.GetToken() !== null;
  }

  Logout() {
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['/login']);
  }

}
