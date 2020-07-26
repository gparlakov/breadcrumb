import { Component, OnInit, OnChanges } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {

  state$: Observable<string>;

  constructor(s: BreadcrumbService) {
    this.state$ = s.state$;
    this.state$.subscribe(console.warn);
  }
}
