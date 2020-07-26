import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesRootComponentComponent } from './countries-root-component.component';

describe('CountriesRootComponentComponent', () => {
  let component: CountriesRootComponentComponent;
  let fixture: ComponentFixture<CountriesRootComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountriesRootComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesRootComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
