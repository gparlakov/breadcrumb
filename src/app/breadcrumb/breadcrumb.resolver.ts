import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BreadcrumbService } from './breadcrumb.service';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbResolver implements Resolve<boolean> {
  constructor(private bs: BreadcrumbService) {
  }

  resolve(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (route && route.data && route.data.breadcrumb) {
      this.bs.onRoute(route.data.breadcrumb, state.url);
    }

    return true;
  }
}
