import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { BreadcrumbResolver } from '../breadcrumb/breadcrumb.resolver';
import { BreadcrumbNameResolver, BreadcrumbNameResolverHolder } from '../breadcrumb/breadcrumb.service';
import { CityComponent } from './city/city.component';
import { CountriesRootComponentComponent } from './countries-root-component.component';
import { CountryComponent } from './country.component';
import { of } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GeoDbProModule, GeoDbService } from 'wft-geodb-angular-client';


const countryBc = 'country';
const cityBc = 'city';

const routes: Routes = [{
  path: '', component: CountriesRootComponentComponent,
  data: {
    breadcrumb: 'root'
  },
  resolve: {
    bc: BreadcrumbResolver
  },
},
{
  path: ':id', component: CountryComponent,
  data: {
    breadcrumb: countryBc
  },
  resolve: {
    bc: BreadcrumbResolver
  },
  children: [
    {
      path: 'city/:id', component: CityComponent,
      data: {
        breadcrumb: cityBc
      },
      resolve: {
        bc: BreadcrumbResolver
      },
    }
  ]
},
  // { path: 'neighboring-country/:id', component: CountryComponent },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HttpClientModule,
    GeoDbProModule.forRoot({
      apiKey: '4e925edd1emsh0d71565331c7c7cp174709jsn6b1e9a01698d',
      serviceUri: 'https://wft-geo-db.p.mashape.com'
    })
  ],
  exports: [RouterModule, BreadcrumbModule]
})
export class CountryRoutingModule {

  constructor(http: HttpClient, private geoDbService: GeoDbService) {

    BreadcrumbNameResolverHolder.add({
      id: countryBc,
      name: (_, url: string) => {
        const countryRouteMatch = new RegExp('country/([!/]*)$|country/(.*)/');
        const idMatch = url.match(countryRouteMatch);
        if (Array.isArray(idMatch)) {
          return http.get<{ name: string }>('https://restcountries.eu/rest/v2/alpha/' + idMatch[1]).pipe(map(r => r.name));
        }
        return of('country/:id');
      }
    });

    BreadcrumbNameResolverHolder.add({
      id: cityBc,
      // 'city' 'city/sf'
      name: (_, url: string) => {
        const countryRouteMatch = new RegExp('city/(.*)$');
        const idMatch = url.match(countryRouteMatch);
        if (Array.isArray(idMatch)) {
          return this.geoDbService.findPlace({ placeId: idMatch[1] })
            .pipe(map(r => r.data.city));
        }
        return of('city/:id');
      }
    });
  }
}
