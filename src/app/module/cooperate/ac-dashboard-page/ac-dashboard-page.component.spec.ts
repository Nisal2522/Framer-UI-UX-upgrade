import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcDashboardPageComponent } from './ac-dashboard-page.component';

describe('AcDashboardPageComponent', () => {
  let component: AcDashboardPageComponent;
  let fixture: ComponentFixture<AcDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcDashboardPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
