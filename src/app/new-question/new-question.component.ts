import {Component, OnInit} from '@angular/core';
import {QuestionsService} from "../questions.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.css']
})
export class NewQuestionComponent implements OnInit {

  public questionText: string;
  public questionTitle: string;

  constructor(
    private service: QuestionsService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
  }

  submit(): void {
    this.service.postQuestion({
      title: this.questionTitle,
      question: this.questionText
    }).subscribe(p => this.router.navigate([`./question/${p}`]));
  }
}
