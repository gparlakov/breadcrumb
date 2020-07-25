import { TestBed } from '@angular/core/testing';

import { BreadcrumbResolver } from './breadcrumb.resolver';

describe('BreadcrumbGuard', () => {
  let guard: BreadcrumbResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BreadcrumbResolver);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
