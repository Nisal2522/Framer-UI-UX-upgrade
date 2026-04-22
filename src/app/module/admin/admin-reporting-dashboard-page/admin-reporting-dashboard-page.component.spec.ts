import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { AdminReportingDashboardPageComponent } from './admin-reporting-dashboard-page.component';

describe('AdminReportingDashboardPageComponent', () => {
  let component: AdminReportingDashboardPageComponent;
  let fixture: ComponentFixture<AdminReportingDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportingDashboardPageComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReportingDashboardPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
