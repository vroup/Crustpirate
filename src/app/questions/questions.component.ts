import { Component, OnInit } from '@angular/core';
import {QuestionsService} from "../questions.service";
import {Question} from "../question";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  constructor(private service: QuestionsService) {
  }

  ngOnInit() {
  }

  get questions(): Question[] {
    return this.service.questions;
  }

  minutesSince(createTime: Date) {
    const ms = Number(new Date()) - Number(new Date(createTime));
    return Math.ceil(ms / 1000 / 60);
  }
}
