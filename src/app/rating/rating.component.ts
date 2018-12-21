import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input() value: number;

  fillAmounts: number[] = new Array(5);

  constructor() {
  }

  ngOnInit() {
    this.loadFillAmounts();
  }

  loadFillAmounts() {
    for (let i = 0; i < 5; i++) {
      this.fillAmounts[i] = Math.min(1, Math.max(0, this.value - i));
    }

    console.log(this.fillAmounts);
  }
}
