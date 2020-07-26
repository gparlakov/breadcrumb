import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryRoutingModule } from './country-routing.module';
import { CountryComponent } from './country.component';
import { NeighboringCountryComponent } from './neighboring-country/neighboring-country.component';
import { CityComponent } from './city/city.component';
import { PlaceOfInterestComponent } from './place-of-interest/place-of-interest.component';
import { CountriesRootComponentComponent } from './countries-root-component.component';

@NgModule({
  declarations: [
    CountryComponent,
    NeighboringCountryComponent,
    CityComponent,
    PlaceOfInterestComponent,
    CountriesRootComponentComponent
  ],
  imports: [
    CommonModule,
    CountryRoutingModule
  ]
})
export class CountryModule { }
