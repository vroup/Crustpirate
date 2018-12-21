import {Component, Input, OnInit, OnChanges, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit, OnChanges {
  @Input()
  value: number;
  // @Output() value: number;

  fillAmounts: number[] = new Array(5);

  constructor() {
  }

  ngOnInit() {
    this.loadFillAmounts(this.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    const v: SimpleChange = changes.value;
    this.loadFillAmounts(v.currentValue);
  }

  /***
   * @description: Fills array specifying the fill amount of corresponding
   * stars as a number between 0 and 1.
   */
  loadFillAmounts(v: number) {
    for (let i = 0; i < 5; i++) {
      this.fillAmounts[i] = Math.min(1, Math.max(0, v - i));
    }
  }
}
