import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWorkflowMinistryTabComponent } from './admin-workflow-ministry-tab.component';

describe('AdminWorkflowMinistryTabComponent', () => {
  let component: AdminWorkflowMinistryTabComponent;
  let fixture: ComponentFixture<AdminWorkflowMinistryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWorkflowMinistryTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminWorkflowMinistryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
