import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {DataService} from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user: string = null;

  constructor(private service: DataService,
              private authService: AuthService) {
  }

  ngOnInit() {
    console.log('subscribing to changes:');
    this.service.changes.subscribe(v => {
      console.log('some changes occured', v);
      this.user = this.authService.GetUser();
    });
  }

  signOut() {
    this.service.Logout();
  }
}
