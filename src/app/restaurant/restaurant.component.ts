import {Component, OnInit} from '@angular/core';
import {Restaurant} from '../view-models/restaurant';
import {Review} from '../view-models/review';
import {ActivatedRoute} from '@angular/router';
import {ReviewService} from '../services/review.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  restaurant: Restaurant;
  reviews: Review[];
  isLoggedIn: boolean;

  constructor(private service: ReviewService,
              private route: ActivatedRoute,
              private authService: AuthService) {
    this.isLoggedIn = authService.IsLoggedIn();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.service.getRestaurant(id).subscribe(r => {
      this.restaurant = r;
    });

    // this.reviews = this.service.reviews;
  }


}
