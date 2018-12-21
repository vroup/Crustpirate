import {Injectable} from '@angular/core';
import {Review} from '../view-models/review';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Restaurant} from '../view-models/restaurant';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private url_prefix: string = environment.express_url;

  reviews: Review[];

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  getRestaurant(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(this.url_prefix + '/api/restaurant/' + id);
  }

  getReviews(restaurantId: string): void {
    this.http.get<Review[]>(this.url_prefix + '/api/reviews/' + restaurantId)
      .subscribe(
        reviews => {
          this.reviews = reviews;
        }
      );
  }

  getLatestReviews(number: number): Observable<Review[]> {
    return this.http.get<Review[]>(this.url_prefix + '/api/reviews/recent/' + number);
  }

  postReview(review: Review): Promise<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.GetToken()}`
      })
    };

    return new Promise<string>((resolve, reject) => {
      this.http.post<string>(this.url_prefix + '/api/review', review, httpOptions)
        .subscribe(restaurantId => resolve(restaurantId));
    });
  }
}
