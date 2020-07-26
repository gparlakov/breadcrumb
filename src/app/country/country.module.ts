import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryRoutingModule } from './country-routing.module';
import { CountryComponent } from './country.component';
import { NeighboringCountryComponent } from './neighboring-country/neighboring-country.component';
import { CityComponent } from './city/city.component';
import { PlaceOfInterestComponent } from './place-of-interest/place-of-interest.component';

@NgModule({
  declarations: [
    CountryComponent,
    NeighboringCountryComponent,
    CityComponent,
    PlaceOfInterestComponent
  ],
  imports: [
    CommonModule,
    CountryRoutingModule
  ]
})
export class CountryModule { }
