import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CountryComponent } from './country/country.component';
import { NeighboringCountryComponent } from './country/neighboring-country/neighboring-country.component';
import { CityComponent } from './country/city/city.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  {
    path: 'country/:id', component: CountryComponent, children: [
      { path: 'city/:id', component: CityComponent }
    ]
  },
  { path: 'neighboring-country/:id', component: NeighboringCountryComponent },
  { path: '**', component: AppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
