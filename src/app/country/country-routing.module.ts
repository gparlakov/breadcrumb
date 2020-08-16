import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { BreadcrumbResolver } from '../breadcrumb/breadcrumb.resolver';
import { BreadcrumbLeaf, BreadcrumbNameResolvers, matchRouteWithParam, Breadcrumb } from '../breadcrumb/breadcrumb.service';
import { CityComponent } from './city/city.component';
import { CountriesRootComponentComponent } from './countries-root-component.component';
import { CountryComponent } from './country.component';


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
  ],
  exports: [RouterModule, BreadcrumbModule]
})
export class CountryRoutingModule {

  constructor(http: HttpClient) {

    BreadcrumbNameResolvers.add({
      id: countryBc,
      resolve: (url: string, _: BreadcrumbLeaf) => {

        return matchRouteWithParam<Observable<Breadcrumb>>(url, 'country/')
          .onMatch((prefix, id) => http
            .get<{ name: string }>('https://restcountries.eu/rest/v2/alpha/' + id)
            .pipe(
              map(r => ({ name: r.name, url: prefix + id }))
            )
          )
          .noMatch(() => of({ name: 'country/:id', url }))
          .go();
      }
    });

    BreadcrumbNameResolvers.add({
      id: cityBc,
      // 'city' 'city/sf'
      resolve: (url: string, _: BreadcrumbLeaf) => {
        return matchRouteWithParam<Observable<Breadcrumb>>(url, 'city/')
          .onMatch((prefix, cityId) => http
            .get<{ data: { wikiDataId: string, name: string } }>(`http://geodb-free-service.wirefreethought.com/v1/geo/cities/${cityId}?wikiDataId=${cityId}&limit=5&offset=0&hateoasMode=false`)
            .pipe(map(r => ({ name: r.data.name, url: prefix + cityId })))
          )
          .noMatch(() => of({ name: 'city/:id', url }))
          .go();
      }
    });
  }
}
