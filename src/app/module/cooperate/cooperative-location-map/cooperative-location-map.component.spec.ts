import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CooperativeLocationMapComponent } from './cooperative-location-map.component';

describe('CooperativeLocationMapComponent', () => {
  let component: CooperativeLocationMapComponent;
  let fixture: ComponentFixture<CooperativeLocationMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CooperativeLocationMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CooperativeLocationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
