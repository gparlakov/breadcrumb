import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryComponent } from './country.component';
import { CityComponent } from './city/city.component';
import { BreadcrumbResolver } from '../breadcrumb/breadcrumb.resolver';

const routes: Routes = [
  {
    path: ':id', component: CountryComponent,
    data: {
      breadcrumb: 'country'
    },
    resolve: {
      bc: BreadcrumbResolver
    },
    children: [
      {
        path: 'city/:id', component: CityComponent,
        data: {
          breadcrumb: 'city'
        },
        resolve: {
          bc: BreadcrumbResolver
        },
      }
    ]
  },
  // { path: 'neighboring-country/:id', component: NeighboringCountryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule { }
