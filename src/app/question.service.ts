import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, timer} from "rxjs";

import {environment} from "../environments/environment";
import {Question} from "./question";
import {Answer} from "./answer";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private url_prefix: string = environment.express_url;

  question: Question;

  constructor(private http: HttpClient) {
  }

  getQuestion(id: number): Observable<Question> {
    return this.http.get<Question>(this.url_prefix + '/api/question/' + id);
  }

  getAnswers(id: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(this.url_prefix + '/api/answers/' + id);
  }

  upVote(id: number, operation: string): void {
    this.http.get(this.url_prefix + '/api/upVote/' + id + '/' + operation).subscribe();
  }

  downVote(id: number, operation: string): void {
    this.http.get(this.url_prefix + '/api/downVote/' + id + '/' + operation).subscribe();
  }

  postAnswer(myAnswer: Answer) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const answer = {
      answer: myAnswer.answer,
      questionId: myAnswer.questionId
    };
    return this.http.post(this.url_prefix + '/api/answer', answer, httpOptions);
  }
}
