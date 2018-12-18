import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, timer} from 'rxjs';

import {environment} from '../environments/environment';
import {Question} from './question';
import {Answer} from './answer';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private url_prefix: string = environment.express_url;

  question: Question;

  constructor(private http: HttpClient,
              private auth: AuthService) {
  }

  getQuestion(id: string): Observable<Question> {
    return this.http.get<Question>(this.url_prefix + '/api/question/' + id);
  }

  getAnswers(id: string): Observable<Answer[]> {
    return this.http.get<Answer[]>(this.url_prefix + '/api/answers/' + id);
  }

  upVote(id: string, operation: string): void {
    this.http.put(`${this.url_prefix}/api/upVote`, {id: id, operation: operation})
      .subscribe(
      p => console.log(p)
    );
  }

  downVote(id: string, operation: string): void {
    this.http.put(this.url_prefix + '/api/downVote', {id: id, operation: operation})
      .subscribe();
  }

  postAnswer(myAnswer: Answer) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.GetToken()}`
      })
    };
    const answer = {
      answer: myAnswer.answer,
      questionId: myAnswer.questionId
    };
    return this.http.post(this.url_prefix + '/api/answer', answer, httpOptions);
  }
}
