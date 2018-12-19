import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  result: string;

  constructor(private service: DataService) {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (form.value.password === form.value.repeatPassword) {
      this.service
        .RegisterNewUser(form.value.username, form.value.password)
        .then(message => {
            this.result = 'Success: Login to start writing reviews.';
          },
          error => this.result = `Error: ${error}`);
    } else {
      this.result = 'Passwords don\'t match!';
    }
  }
}
