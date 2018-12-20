import {Injectable} from '@angular/core';
import {Restaurant} from '../view-models/restaurant';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private url_prefix: string = environment.express_url;
  restaurants: Restaurant[];

  constructor(private http: HttpClient) {
    this.getRestaurants();
  }

  getRestaurants(): void {
    this.http.get<Restaurant[]>(this.url_prefix + '/api/restaurants').subscribe(
      restaurants => {
        this.restaurants = restaurants;
      }
    );
  }
}
