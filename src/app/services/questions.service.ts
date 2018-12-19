import {Injectable} from '@angular/core';
import {timer} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Question} from '../view-models/question';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private url_prefix: string = environment.express_url;
  private charLimit = 1000;

  questions: Question[] = [];

  constructor(private http: HttpClient,
              private auth: AuthService) {
    timer(0, 10000)
      .pipe(switchMap(
        () => this.http.get<Question[]>(this.url_prefix + '/api/questions'))
      ).subscribe(data => {
      this.questions = data;
    });
  }

  postQuestion(question: any) {
    try {
      if (question.title === undefined || question.title.trim().length === 0) {
        throw new Error('Question title is missing.');
      }

      if (question.question === undefined || question.question.trim().length === 0) {
        throw new Error('Question body is missing.');
      }

      if (question.question.length > this.charLimit) {
        throw new Error(`Please make your question shorter. The limit is ${this.charLimit} characters.`);
      }

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.auth.GetToken()}`
        })
      };

      return this.http.post(this.url_prefix + '/api/question', question, httpOptions);

    } catch (ex) {
      alert(ex);
    }
  }
}
