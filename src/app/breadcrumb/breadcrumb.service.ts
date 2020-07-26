import { Injectable } from '@angular/core';
import { Observable, isObservable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private state = new BehaviorSubject<string>('');
  public state$ = this.state.asObservable();

  constructor(private resolvers: BreadcrumbNameResolverHolder) {
    console.log(BreadcrumbNameResolverHolder.name);
  }
  onRoute(id: string, url: string) {
    console.log('---', id, url);
    const bc = tree[id];
    let name = '...';
    const res = this.resolvers.get().find(r => r.id === bc.id);
    if (res == null) {
      console.log('resolver not found - using the data name');
      name = bc.name;
    } else {
      if (isObservable(res.name)) {
        res.name.pipe(take(1)).subscribe(n => name = n);
      } else {
        name = res.name;
      }
    }

    const v = this.state.value;
    if (v.includes(bc.id)) {
      // we are subtracting from the state
      const i = v.indexOf(bc.id);
      this.state.next(v.slice(0, i + bc.id.length));
    } else {
      const breadCrumbs = 'root' in bc && bc.root === true
        ? bc.id
        : getParents(bc);

      this.state.next(breadCrumbs);
    }
  }
}

const tree: { [k: string]: Breadcrumb | null } = {
  root: { root: true, name: 'root name', id: 'root' },
  country: { parent: 'root', id: 'country' },
  city: { parent: 'country', id: 'city' }
};

function getParents(b: Breadcrumb) {
  if ('root' in b) {
    return 'root';
  } else {
    return `${getParents(tree[b.parent])}/${b.id}`;
  }
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbNameResolverHolder {

  constructor() {
    console.log(BreadcrumbNameResolverHolder.name);
  }
  resolvers: BreadcrumbNameResolver[] = [];
  addResolver(r: BreadcrumbNameResolver) {
    this.resolvers.push(r);
  }

  get() {
    return [...this.resolvers];
  }
}

export interface BreadcrumbNameResolver {
  id: Breadcrumb['id'];
  name: string | Observable<string>;
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

export const Mapping = new Map<Breadcrumb['id'], Function>();
