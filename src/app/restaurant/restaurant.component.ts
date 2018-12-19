import { Component, OnInit } from '@angular/core';
import {Restaurant} from '../view-models/restaurant';
import {RestaurantService} from '../services/restaurant.service';
import {Review} from '../view-models/review';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  restaurant: Restaurant;
  reviews: Review[];

  constructor(private service: RestaurantService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.reviews = this.service.reviews;
  }

}
