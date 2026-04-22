import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWorkflowCompareTabComponent } from './admin-workflow-compare-tab.component';

describe('AdminWorkflowCompareTabComponent', () => {
  let component: AdminWorkflowCompareTabComponent;
  let fixture: ComponentFixture<AdminWorkflowCompareTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWorkflowCompareTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminWorkflowCompareTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
