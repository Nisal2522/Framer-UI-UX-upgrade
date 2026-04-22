import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { NationalDashboardPageComponent } from './national-dashboard-page.component';

describe('NationalDashboardPageComponent', () => {
  let component: NationalDashboardPageComponent;
  let fixture: ComponentFixture<NationalDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NationalDashboardPageComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NationalDashboardPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
