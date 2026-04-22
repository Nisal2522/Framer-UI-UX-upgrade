import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWorkflowSupportTabComponent } from './admin-workflow-support-tab.component';

describe('AdminWorkflowSupportTabComponent', () => {
  let component: AdminWorkflowSupportTabComponent;
  let fixture: ComponentFixture<AdminWorkflowSupportTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWorkflowSupportTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminWorkflowSupportTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
