import {Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message: string;

  constructor(
    private dataService: DataService) {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.dataService.Authenticate(form.value.username, form.value.password)
      .then(() => {
      }, response => {
        this.message = response.error.message;
      });
  }
}
