import {Component, HostListener, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnInit {

  constructor() {
  }
  @Input() fillAmount: number;
  @Input() value: number;

  widthExp: number;

  @HostListener('mouseenter') onMouseEnter() {
    // this.highlight(this.highlightColor || 'red');
  }

  ngOnInit() {
    this.widthExp = this.fillAmount * 100;
  }
}
