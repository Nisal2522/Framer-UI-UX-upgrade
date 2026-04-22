import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { ProvincialDashboardPageComponent } from './provincial-dashboard-page.component';

describe('ProvincialDashboardPageComponent', () => {
  let component: ProvincialDashboardPageComponent;
  let fixture: ComponentFixture<ProvincialDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvincialDashboardPageComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProvincialDashboardPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
