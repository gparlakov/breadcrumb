import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceOfInterestComponent } from './place-of-interest.component';

describe('PlaceOfInterestComponent', () => {
  let component: PlaceOfInterestComponent;
  let fixture: ComponentFixture<PlaceOfInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceOfInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceOfInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
