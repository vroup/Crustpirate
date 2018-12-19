import {Injectable} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url_prefix: string = environment.express_url;
  private httpOptions = {};

  data: any[] = [];
  pollster: Subscription;

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
    this.pollster = timer(0, 1000)
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
    this.http.post<any>(`${this.url_prefix}/api/authenticate/`, {
      username: username,
      password: password
    }).subscribe(data => {
      this.auth.SetToken(data.token);
      this.CreateHttpOptions();
      this.StartPollster();
      this.router.navigate(['/questions'])
        .then(() => {console.log('Navigated!'); });
    });
  }
}
