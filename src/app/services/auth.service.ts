import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../view-models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  storageKey = 'foobar-jwt';
  usernameKey = 'crust-pirate-user';

  constructor(private router: Router) {
  }

  SetUser(user: User): void {
    const userString = JSON.stringify(user);
    localStorage.setItem(this.usernameKey, userString);
  }

  SetToken(token: string): void {
    localStorage.setItem(this.storageKey, token);
  }

  GetUser(): User {
    const userString = localStorage.getItem(this.usernameKey);
    const user = JSON.parse(userString);
    return user;
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
