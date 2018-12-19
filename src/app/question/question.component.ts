import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Question} from '../view-models/question';
import {Answer} from '../view-models/answer';
import {QuestionService} from '../services/question.service';
import {timer} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  private charLimit = 280;

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
    const id = this.route.snapshot.paramMap.get('id');
    this.service.getQuestion(id).subscribe(q => {
      this.question = q;
    });
    timer(0, 1000)
      .pipe(switchMap(
        () => this.service.getAnswers(id))
      ).subscribe(data => this.answers = data);
  }

  // Annul up-vote if already voted up - otherwise vote up.
  toggleUpVote(id: string) {
    if (this.upVoted[id]) {
      // Annul vote.
      this.answers.find(a => a._id === id).votesFor--;
      this.service.upVote(id, 'decrement');
      this.upVoted[id] = false;
    } else if (id !== '-') {
      // Cast vote.
      if (this.downVoted[id]) {
        this.toggleDownVote(id);
      }
      this.answers.find(a => a._id === id).votesFor++;
      this.service.upVote(id, 'increment');
      this.upVoted[id] = true;
    } else {
      window.alert('Wait a little!');
    }
  }

  toggleDownVote(id: string) {
    if (this.downVoted[id]) {
      // Annul vote.
      this.answers.find(a => a._id === id).votesAgainst--;
      this.service.downVote(id, 'decrement');
      this.downVoted[id] = false;
    } else if (id !== '-') {
      // Cast vote.
      if (this.upVoted[id]) {
        this.toggleUpVote(id);
      }
      this.answers.find(a => a._id === id).votesAgainst++;
      this.service.downVote(id, 'increment');
      this.downVoted[id] = true;
    } else {
      window.alert('Wait a little!');
    }
  }

  submitAnswer(): void {
    try {
      this.submitEnabled = false;

      if (this.answerText === undefined || this.answerText.trim().length === 0) {
        alert(`Answer body is missing.`);
        this.submitEnabled = true;
      }
      if (this.answerText.length > this.charLimit) {
        alert(`Your text is too long! Limit is ${this.charLimit} characters.`);
        this.submitEnabled = true;
      }

      const myAnswer = {
        _id: '-',
        answer: this.answerText,
        questionId: this.question._id,
        createTime: new Date(),
        votesFor: 0,
        votesAgainst: 0
      };
      this.service.postAnswer(myAnswer).subscribe(() => {
        this.answerText = '';
        this.submitEnabled = true;
        this.answers.push(myAnswer);
      });

    } catch (ex) {
      window.alert(ex);
      this.submitEnabled = true;
    }
  }
}
