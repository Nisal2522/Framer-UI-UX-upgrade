import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWorkflowHistoryTabComponent } from './admin-workflow-history-tab.component';

describe('AdminWorkflowHistoryTabComponent', () => {
  let component: AdminWorkflowHistoryTabComponent;
  let fixture: ComponentFixture<AdminWorkflowHistoryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWorkflowHistoryTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminWorkflowHistoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
