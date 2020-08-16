import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbNameResolver } from './breadcrumb.service';
import { RouterModule } from '@angular/router';

export const BreadcrumbNameResolverToken = new InjectionToken<BreadcrumbNameResolver[]>('Injects the breadcrumb name resolvers');
@NgModule({
  declarations: [BreadcrumbComponent],
  exports: [BreadcrumbComponent],
  imports: [
    CommonModule
    , RouterModule
  ]
})
export class BreadcrumbModule {
  static addRoute(r: BreadcrumbNameResolver): ModuleWithProviders<BreadcrumbModule> {
    return {
      ngModule: BreadcrumbModule,
      providers: [
        { provide: BreadcrumbNameResolverToken, useValue: r, multi: true }
      ]
    };
  }
}
