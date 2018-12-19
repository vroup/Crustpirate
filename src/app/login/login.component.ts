import {Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private dataService: DataService) {
  }

  ngOnInit() {
//    this.username.value = '4';
  }

  onSubmit(form: NgForm) {
    this.dataService.Authenticate(form.value.username, form.value.password);
  }
}
