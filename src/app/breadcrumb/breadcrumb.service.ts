import { Injectable, Inject } from '@angular/core';
import { Observable, isObservable, BehaviorSubject, of, forkJoin } from 'rxjs';
import { take, defaultIfEmpty } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private state = new BehaviorSubject<string>('');
  public state$ = this.state.asObservable();

  private names = new BehaviorSubject<string[]>(['']);
  public names$ = this.names.asObservable();

  constructor() {
  }
  onRoute(id: string, url: string) {
    const bc = tree[id];

    const breadCrumbs = 'root' in bc && bc.root === true
      ? bc.id
      : buildBreadcrumbsFromTheBottomUp(bc, '/');

    this.state.next(breadCrumbs);

    const nameResolvers = BreadcrumbNameResolverHolder.get();

    forkJoin(
      breadCrumbs
        .split('/')
        .map(i => {
          const res = nameResolvers.find(r => r.id === i);
          if (res == null) {
            return of(bc.name);
          } else {
            if (typeof res.name === 'string') {
              return of(res.name);
            } else {
              return res.name(id, url);
            }
          }
        }))
      .pipe(defaultIfEmpty([] as string[]), take(1))
      .subscribe(n => this.names.next(n));

  }
}

const tree: { [k: string]: Breadcrumb | null } = {
  root: { root: true, name: 'root name', id: 'root' },
  country: { parent: 'root', id: 'country' },
  city: { parent: 'country', id: 'city' }
};

export type BreadcrumbUrl = {
  name: string;
  url: string;
};

function buildBreadcrumbsFromTheBottomUp(b: Breadcrumb, separator: string = '/'): string {
  if ('root' in b) {
    return 'root';
  } else {
    return `${buildBreadcrumbsFromTheBottomUp(tree[b.parent])}${separator}${b.id}`;
  }
}

const resolvers: BreadcrumbNameResolver[] = [];
export class BreadcrumbNameResolverHolder {

  static add(r: BreadcrumbNameResolver) {
    resolvers.push(r);
  }

  static get() {
    return [...resolvers];
  }
}

export interface BreadcrumbNameResolver {
  id: Breadcrumb['id'];
  name: string | ((id: string, url: string) => Observable<string>);
}

export type Breadcrumb = {
  root: true,
  id: 'root',
  name: string;
} | {
  id: string;
  name?: string;
  parent: string;
};
