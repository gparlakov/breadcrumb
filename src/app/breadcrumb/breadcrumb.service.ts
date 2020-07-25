import { Injectable } from '@angular/core';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  onRoute(data: Data, url: string) {
    console.log('---', data, url);
  }

  constructor() { }
}
