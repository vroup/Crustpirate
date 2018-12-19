import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  storageKey = 'foobar-jwt';
  usernameKey = 'crust-pirate-user';

  constructor(private router: Router) {
  }

  SetUser(user: string): void {
    localStorage.setItem(this.usernameKey, user);
  }

  SetToken(token: string): void {
    localStorage.setItem(this.storageKey, token);
  }

  GetUser(): string {
    return localStorage.getItem(this.usernameKey);
  }

  GetToken(): string {
    return localStorage.getItem(this.storageKey);
  }

  IsLoggedIn(): boolean {
    return this.GetToken() !== null;
  }

  Logout() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.usernameKey);
    this.router.navigate(['/']);
  }

}
