import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Question} from "../question";
import {Answer} from "../answer";
import {QuestionService} from "../question.service";
import {timer} from "rxjs";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  question: Question;
  answers: Answer[];

  upVoted = {};
  downVoted = {};

  answerText: string;
  submitEnabled = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: QuestionService) {
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getQuestion(id).subscribe(q => this.question = q);
    timer(0, 10000)
      .pipe(switchMap(
        () => this.service.getAnswers(id))
      ).subscribe(data => this.answers = data);
  }

  toggleUpVote(id: number) {
    if (this.upVoted[id]) {
      // Annul vote.
      this.answers.find(a => a.id === id).votesFor--;
      this.service.upVote(id, 'decrement');
      this.upVoted[id] = false;
    } else if (id !== -1) {
      // Cast vote.
      if (this.downVoted[id]) {
        this.toggleDownVote(id);
      }
      this.answers.find(a => a.id === id).votesFor++;
      this.service.upVote(id, 'increment');
      this.upVoted[id] = true;
    } else {
      window.alert("Wait a little!");
    }
  }

  toggleDownVote(id: number) {
    if (this.downVoted[id]) {
      // Annul vote.
      this.answers.find(a => a.id === id).votesAgainst--;
      this.service.downVote(id, 'decrement');
      this.downVoted[id] = false;
    } else if (id !== -1) {
      // Cast vote.
      if (this.upVoted[id]) {
        this.toggleUpVote(id);
      }
      this.answers.find(a => a.id === id).votesAgainst++;
      this.service.downVote(id, 'increment');
      this.downVoted[id] = true;
    } else {
      window.alert("Wait a little!");
    }
  }

  submitAnswer(): void {
    this.submitEnabled = false;
    const myAnswer = {
      id: -1,
      answer: this.answerText,
      questionId: this.question.id,
      createTime: new Date(),
      votesFor: 0,
      votesAgainst: 0
    };
    this.service.postAnswer(myAnswer).subscribe(() => {
      this.answerText = "";
      this.submitEnabled = true;
      this.answers.push(myAnswer);
    });
  }
}
