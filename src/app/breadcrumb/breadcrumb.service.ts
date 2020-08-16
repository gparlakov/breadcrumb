import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { defaultIfEmpty, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private state = new BehaviorSubject<string>('');
  public state$ = this.state.asObservable();

  private crumbs = new BehaviorSubject<Breadcrumb[]>([{} as Breadcrumb]);
  public crumbs$ = this.crumbs.asObservable().pipe();

  constructor() {
  }
  onRoute(id: string, url: string) {
    const bc = tree[id];

    if (bc == null) {
      throw new Error('Missing breadcrumb leaf in the breadcrumb tree for ' + id);
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
            return defaultBreadcrumbName(`/${i}`, tree[i]);
          }
          else {
            return res.resolve(url, bc);
          }
        }))
      .pipe(defaultIfEmpty([] as Breadcrumb[]), take(1))
      .subscribe(n => this.crumbs.next(n));
  }

  onCrumbInteract(b: Breadcrumb) {
    this.crumbs$.pipe(take(1)).subscribe(cs => {
      const index = cs.findIndex(c => c.name === b.name);
      this.crumbs.next(cs.slice(0, index + 1));
    });
  }
}



const tree: { [k: string]: BreadcrumbLeaf | null } = {
  root: { root: true, name: 'Root', id: 'root' },
  country: { parent: 'root', id: 'country' },
  city: { parent: 'country', id: 'city' }
};

export type Breadcrumb = {
  name: string;
  url: string;
};

function buildBreadcrumbsFromTheBottomUp(b: BreadcrumbLeaf, separator: string = '/'): string {
  if ('root' in b || !b.parent) {
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
  resolve: (url: string, bc: BreadcrumbLeaf) => Observable<Breadcrumb>;
}
export const defaultBreadcrumbName: BreadcrumbNameResolver['resolve'] = (url, t) => {
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
  const normalizedRoute = route[route.length - 1] === '/' ? route : route + '/';
  const matcher = new RegExp(`^(.*${normalizedRoute})([^/]*)$|^(.*${normalizedRoute})([^/]*)`);
  const matches = url.match(matcher);
  const hasMatches = Array.isArray(matches) && matches[2] != null || matches[4] != null;
  const prefix = matches[2] ? matches[1] : matches[4] ? matches[3] : route;
  const match = matches[2] || matches[4];

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
      return hasMatches ? onMatch(prefix, match) : noMatch();
    }
  };

  return a;
}
