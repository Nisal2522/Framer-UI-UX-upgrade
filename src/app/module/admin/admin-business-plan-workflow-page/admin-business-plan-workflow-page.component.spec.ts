import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBusinessPlanWorkflowPageComponent } from './admin-business-plan-workflow-page.component';

describe('AdminBusinessPlanWorkflowPageComponent', () => {
  let component: AdminBusinessPlanWorkflowPageComponent;
  let fixture: ComponentFixture<AdminBusinessPlanWorkflowPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBusinessPlanWorkflowPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBusinessPlanWorkflowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
