import {Injectable} from '@angular/core';
import {Restaurant} from '../view-models/restaurant';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Review} from '../view-models/review';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private url_prefix: string = environment.express_url;
  restaurants: Restaurant[];
  reviews: Review[];

  constructor(private http: HttpClient) {
    this.getRestaurants();
  }

  getRestaurants(): void {
    this.http.get<Restaurant[]>(this.url_prefix + '/api/restaurants').subscribe(
      restaurants => {
        this.restaurants = restaurants;
        console.log(restaurants);
      }
    );
  }

  getReviews(restaurantId: number): void {
    this.http.get<Review[]>(this.url_prefix + '/api/reviews/' + restaurantId).subscribe(
      reviews => {
        this.reviews = reviews;
        console.log(reviews);
      }
    );
  }
}
