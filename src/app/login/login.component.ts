import {Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message: string;
  returnUrl: string;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit() {
    if (this.authService.IsLoggedIn()) {
      this.router.navigate(['/']).then(() => console.log('success!'));
    }

    // get return url from route parameters or default to '/'
    const urlReducer = (accumulator, currentPart) => accumulator + '/' + currentPart;

    const url = this.route.snapshot.queryParams['returnUrl'];

    this.returnUrl = url !== undefined ? url.reduce(urlReducer, '') : '/';
  }

  onSubmit(form: NgForm) {
    this.dataService.Authenticate(form.value.username, form.value.password, this.returnUrl)
      .then(() => {
      }, response => {
        this.message = response.error.message;
      });
  }
}
