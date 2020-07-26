import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  city: string;

  constructor(r: ActivatedRoute) {
    r.paramMap.subscribe(o => this.city = o.get('id'));
  }
  ngOnInit(): void {
  }

}
