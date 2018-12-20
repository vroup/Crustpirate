import {Injectable} from '@angular/core';
import {Review} from '../view-models/review';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Restaurant} from '../view-models/restaurant';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private url_prefix: string = environment.express_url;

  reviews: Review[];

  constructor(private http: HttpClient) {
  }

  getRestaurant(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(this.url_prefix + '/api/restaurant/' + id);
  }

  getReviews(restaurantId: number): void {
    this.http.get<Review[]>(this.url_prefix + '/api/reviews/' + restaurantId).subscribe(
      reviews => {
        this.reviews = reviews;
      }
    );
  }
}
