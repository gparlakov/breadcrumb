import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeoDbProModule, GeoDbService } from 'wft-geodb-angular-client';
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
    GeoDbProModule.forRoot({
      apiKey: '4e925edd1emsh0d71565331c7c7cp174709jsn6b1e9a01698d',
      serviceUri: 'https://wft-geo-db.p.mashape.com'
    })
  ],
  exports: [RouterModule, BreadcrumbModule]
})
export class CountryRoutingModule {

  constructor(http: HttpClient, private geoDbService: GeoDbService) {

    BreadcrumbNameResolvers.add({
      id: countryBc,
      resolve: (url: string, _: BreadcrumbLeaf) => {

        return matchRouteWithParam<Observable<Breadcrumb>>(url, 'country/')
          .onMatch((url, id) => http
            .get<{ name: string }>('https://restcountries.eu/rest/v2/alpha/' + id)
            .pipe(
              map(r => ({ name: r.name, url: url + id }))
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


        // try and use the free tier
        /**
         * fetch("http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=Sofia&limit=5&offset=0&hateoasMode=false", {
            "headers": {
              "accept": "application/json",
              "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
              "content-type": "application/json"
            },
            "referrer": "http://wft-geodb-demo.s3-website-us-west-2.amazonaws.com/index.html",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
          });
         */
        return matchRouteWithParam<Observable<Breadcrumb>>(url, 'city/')
          .onMatch((prefix, param) => this.geoDbService.findPlace({ placeId: param })
            .pipe(map(r => ({name: r.data.city, url: prefix + param})))
          )
          .noMatch(() => of({ name: 'city/:id', url }))
          .go();
      }
    });
  }
}
