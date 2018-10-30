import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {
  private theId : number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DataService) { }

  ngOnInit() {
    this.theId = parseInt(this.route.snapshot.paramMap.get('id'));
  }

  get id() : number {
    return this.theId;
  }

  get data() : any {
    return this.service.data.find(d => d.id == this.theId);
  }

}
