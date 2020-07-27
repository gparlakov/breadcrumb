import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { defaultIfEmpty, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private state = new BehaviorSubject<string>('');
  public state$ = this.state.asObservable();

  private names = new BehaviorSubject<Breadcrumb[]>([{} as Breadcrumb]);
  public names$ = this.names.asObservable();

  constructor() {
  }
  onRoute(id: string, url: string) {
    const bc = tree[id];

    if (bc == null) {
      throw new Error('Missing breadcrumb lef in the breadcrumb tree for ' + id);
    }

    const breadCrumbs = 'root' in bc && bc.root === true
      ? bc.id
      : buildBreadcrumbsFromTheBottomUp(bc, '/');

    this.state.next(breadCrumbs);

    const nameResolvers = BreadcrumbNameResolvers.get();

    forkJoin(
      breadCrumbs
        .split('/')
        .map(i => {
          const res = nameResolvers.find(r => r.id === i);
          if (res == null) {
            return defaultBreadcrumbName(url, bc);
          } else {
            return res.name(url, bc);
          }
        }))
      .pipe(defaultIfEmpty([] as Breadcrumb[]), take(1))
      .subscribe(n => this.names.next(n));

  }
}

const tree: { [k: string]: BreadcrumbLeaf | null } = {
  root: { root: true, name: 'root name', id: 'root' },
  country: { parent: 'root', id: 'country' },
  city: { parent: 'country', id: 'city' }
};

export type Breadcrumb = {
  name: string;
  url: string;
};

function buildBreadcrumbsFromTheBottomUp(b: BreadcrumbLeaf, separator: string = '/'): string {
  if ('root' in b) {
    return 'root';
  } else {
    return `${buildBreadcrumbsFromTheBottomUp(tree[b.parent])}${separator}${b.id}`;
  }
}

const resolvers: BreadcrumbNameResolver[] = [];
export class BreadcrumbNameResolvers {

  static add(r: BreadcrumbNameResolver) {
    resolvers.push(r);
  }

  static get() {
    return [...resolvers];
  }
}

export interface BreadcrumbNameResolver {
  id: BreadcrumbLeaf['id'];
  name: (url: string, bc: BreadcrumbLeaf) => Observable<Breadcrumb>;
}
export const defaultBreadcrumbName: BreadcrumbNameResolver['name'] = (url, t) => {
  return of({ name: t.name, url });
};

export type BreadcrumbLeaf = {
  root: true,
  id: 'root',
  name: string;
} | {
  id: string;
  name?: string;
  parent: string;
};

export function matchRouteWithParam<T>(url: string, route: string) {
  const matcher = new RegExp(`^.*(${route})([!/]*)$|^.*(${route})(.*/)`);
  const matches = url.match(matcher);
  const hasMatches = Array.isArray(matches) && matches.length === 3;
  // matches consists of 0: the whole string 1: the first matched group i.e. (${route}) 2: the second matched group (.*/) | ([!/]*)$
  // i.e. 'root/country/BGR/city/SFA'.match(country/) => [1] === 'country/' [2]==='BGR'

  let onMatch: (routePrefix: string, routeParam: string) => T;
  let noMatch: () => T;

  const a = {
    onMatch(fn: (routePrefix: string, routeParam: string) => T) {
      onMatch = fn;
      return b;
    }
  };
  const b = {
    noMatch(fn: () => T) {
      noMatch = fn;
      return c;
    }
  };
  const c = {
    go() {
      return hasMatches ? onMatch(matches[1], matches[2]) : noMatch();
    }
  };

  return a;
}
