import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryRoutingModule } from './country-routing.module';
import { CountryComponent } from './country.component';
import { NeighboringCountryComponent } from './neighboring-country/neighboring-country.component';
import { CityComponent } from './city/city.component';
import { PlaceOfInterestComponent } from './place-of-interest/place-of-interest.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    CountryComponent,
    NeighboringCountryComponent,
    CityComponent,
    PlaceOfInterestComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class CountryModule { }
