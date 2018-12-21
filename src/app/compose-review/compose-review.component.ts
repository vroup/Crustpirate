import {Component, OnInit} from '@angular/core';
import {ReviewService} from '../services/review.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Restaurant} from '../view-models/restaurant';
import {Review} from '../view-models/review';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-compose-review',
  templateUrl: './compose-review.component.html',
  styleUrls: ['./compose-review.component.css']
})
export class ComposeReviewComponent implements OnInit {
  restaurant: Restaurant;
  isLoggedIn: boolean;
  rating: number;
  review: string;

  constructor(private service: ReviewService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
    this.isLoggedIn = authService.IsLoggedIn();

  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.service.getRestaurant(id).subscribe(r => {
      this.restaurant = r;
    });
  }

  onSubmit(f: NgForm) {
    const review = new Review();
    review.title = f.value.title;
    review.userId = this.authService.GetUser().id;
    review.restaurantId = this.restaurant._id;
    review.text = f.value.review;
    review.rating = f.value.rating || 3;

    this.service.postReview(review).then(message => {
      console.log(message);
      this.router.navigate(['/restaurant/' + this.restaurant._id]);
    });
  }

  ratingChange(rating: number | any) {
    this.rating = rating;
  }
}
