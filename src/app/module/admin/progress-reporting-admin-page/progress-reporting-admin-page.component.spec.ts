import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressReportingAdminPageComponent } from './progress-reporting-admin-page.component';

describe('ProgressReportingAdminPageComponent', () => {
  let component: ProgressReportingAdminPageComponent;
  let fixture: ComponentFixture<ProgressReportingAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressReportingAdminPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressReportingAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
