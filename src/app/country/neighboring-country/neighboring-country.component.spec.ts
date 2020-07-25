import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighboringCountryComponent } from './neighboring-country.component';

describe('neighboringCountryComponent', () => {
  let component: NeighboringCountryComponent;
  let fixture: ComponentFixture<NeighboringCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeighboringCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeighboringCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
