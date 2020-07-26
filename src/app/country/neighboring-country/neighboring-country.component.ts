import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-neighboring-country',
  templateUrl: './neighboring-country.component.html',
  styleUrls: ['./neighboring-country.component.css']
})
export class NeighboringCountryComponent implements OnInit {
  country: string;

  constructor(r: ActivatedRoute) {
    r.paramMap.subscribe(o => this.country = o.get('id'));
  }

  ngOnInit(): void {
  }

}
