import {Injectable} from '@angular/core';
import {timer} from "rxjs";
import {switchMap} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Question} from "./question";

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private url_prefix: string = environment.express_url;

  questions: Question[] = [];

  constructor(private http: HttpClient) {
    timer(0, 10000)
      .pipe(switchMap(
        _ => this.http.get<Question[]>(this.url_prefix + '/api/questions'))
      ).subscribe(data => {
      this.questions = data;
    });
  }

  postQuestion(question: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(this.url_prefix + '/api/question', question, httpOptions);
  }
}

/*
export interface Question {
  title: string,
  question: string,
  createTime: Date,
  updateTime: Date,
  id: number
}
*/

/*
export interface Answer {
  answer: string,
  questionId: number,
  votesFor: number,
  votesAgainst: number
}
*/
