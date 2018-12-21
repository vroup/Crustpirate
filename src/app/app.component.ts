import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {DataService} from './services/data.service';
import {User} from './view-models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user: User = null;

  constructor(private service: DataService,
              private authService: AuthService) {
  }

  ngOnInit() {
    console.log('subscribing to changes:');
    this.service.changes.subscribe(v => {
      console.log('Login status changed:', v);
      this.user = this.authService.GetUser();
    });
  }

  signOut() {
    this.service.Logout();
  }
}
