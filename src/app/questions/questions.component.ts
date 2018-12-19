import {Component, OnInit} from '@angular/core';
import {QuestionsService} from '../services/questions.service';
import {Question} from '../view-models/question';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  static minutesSince(createTime: Date) {
    const ms = Number(new Date()) - Number(new Date(createTime));
    const year = 1000 * 60 * 60 * 24 * 365.25;
    const week = 1000 * 60 * 60 * 24 * 7;
    const day = 1000 * 60 * 60 * 24;
    const hour = 1000 * 60 * 60;
    const minute = 1000 * 60;
    const second = 1000;

    if (ms > year) {
      const years = Math.floor(ms / year);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (ms > week) {
      const weeks = Math.floor(ms / week);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (ms > day) {
      const days = Math.floor(ms / day);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (ms > hour) {
      const hours = Math.floor(ms / hour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (ms > minute) {
      const minutes = Math.floor(ms / minute);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (ms > second) {
      const seconds = Math.floor(ms / second);
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    } else {
      return 'now';
    }
  }

  constructor(private service: QuestionsService) {
  }

  ngOnInit() {
  }

  get questions(): Question[] {
    return this.service.questions;
  }
}
