import {Component, OnInit} from '@angular/core';
import {RestaurantService} from '../services/restaurant.service';
import {Restaurant} from '../view-models/restaurant';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  constructor(private service: RestaurantService,
              private router: Router) {
  }

  ngOnInit() {
  }

  get restaurants(): Restaurant[] {
    return this.service.restaurants;
  }

  goToRestaurant(f: NgForm) {
    const id: string = f.value.restaurant._id;
    this.router.navigate(['/restaurant/' + id]);
  }
}
