import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {DataService} from '../services/data.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private dataService: DataService) {
  }

  ngOnInit() {
//    this.username.value = '4';
  }

  onSubmit(form: NgForm) {
    // console.log(form.value.username, form.value.password);
    this.dataService.Authenticate(form.value.username, form.value.password);
  }
}
