import {Injectable} from '@angular/core';
import {BehaviorSubject, Subscription, timer} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import {User} from '../view-models/User';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url_prefix: string = environment.express_url;
  private httpOptions = {};

  data: any[] = [];
  pollster: Subscription;
  changes: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router) {

    if (this.auth.IsLoggedIn()) {
      this.CreateHttpOptions();
      this.StartPollster();
    } else {
      console.log('You\'re not logged in, so we won\'t poll.');
    }
  }

  CreateHttpOptions() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.GetToken()}`
      })
    };
  }

  StartPollster() {
    console.log('Starting pollster.');
    this.pollster = timer(0, 10000)
      .pipe(switchMap(
        () => this.http.get<any[]>(this.url_prefix + '/api/my_data', this.httpOptions))
      ).subscribe(data => {
        // console.log(data);
        this.data = data;
      });
  }

  StopPollster() {
    console.log('Stopping pollster.');
    this.pollster.unsubscribe();
  }

  Authenticate(username, password) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${this.url_prefix}/api/authenticate/`, {
        username: username,
        password: password
      }).subscribe(data => {
        const user: User = {username: data.username, id: data.id};
        this.auth.SetToken(data.token);
        this.auth.SetUser(user);
        this.CreateHttpOptions();
        // this.StartPollster();
        this.router.navigate(['/'])
          .then(() => {
            this.changes.next(true);
            resolve('Navigated!');
          });
      }, error => {
        reject(error);
      });
    });
  }

  Logout() {
    this.auth.Logout();
    this.changes.next(false);
  }

  RegisterNewUser(username, password): Promise<string> {
    const user = {
      username: username,
      password: password
    };

    return new Promise((resolve, reject) => {
      this.http.post<any>(`${this.url_prefix}/api/new_user`, user)
        .subscribe(response => resolve(response.message), response => {
          reject(response.error);
        });
    });
  }
}
