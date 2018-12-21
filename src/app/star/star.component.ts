import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnInit {
  @Input() fillAmount: number;
  widthExp: number;

  constructor() {
  }

  ngOnInit() {
    this.widthExp = this.fillAmount * 100;
    console.log(this.widthExp);
  }

}
