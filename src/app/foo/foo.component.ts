import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.css']
})
export class FooComponent implements OnInit {

  constructor(
    private service : DataService,
    private router : Router
  ) { }

  ngOnInit() {
  }

  GetData() : any[] {
    return this.service.data;
  }

}
