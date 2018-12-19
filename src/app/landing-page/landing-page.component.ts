import {Component, OnInit} from '@angular/core';
import {RestaurantService} from '../services/restaurant.service';
import {Restaurant} from '../view-models/restaurant';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  selectedRestaurantId: number;

  constructor(private service: RestaurantService) {
  }

  ngOnInit() {
  }

  get restaurants(): Restaurant[] {
    return this.service.restaurants;
  }


}
