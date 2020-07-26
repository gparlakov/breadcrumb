import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  country = 'Select a country';

  constructor(r: ActivatedRoute) {
    r.paramMap.subscribe(o => this.country = o.get('id'));
  }

  ngOnInit(): void {
  }
}
