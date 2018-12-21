import {Component, OnInit} from '@angular/core';
import {ReviewService} from '../services/review.service';
import {timer} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Review} from '../view-models/review';

@Component({
  selector: 'app-review-streamer',
  templateUrl: './review-streamer.component.html',
  styleUrls: ['./review-streamer.component.css']
})
export class ReviewStreamerComponent implements OnInit {
  reviews: Review[] = [];

  constructor(private reviewService: ReviewService) {
    timer(0, 1000)
      .pipe(switchMap( () =>
        reviewService.getLatestReviews(10)
      )).subscribe(data => {
        this.reviews = data;
      });


    reviewService.getLatestReviews(10);
  }

  ngOnInit() {
  }

}
