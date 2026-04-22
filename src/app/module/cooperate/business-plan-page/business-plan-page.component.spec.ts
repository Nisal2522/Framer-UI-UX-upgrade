import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPlanPageComponent } from './business-plan-page.component';

describe('BusinessPlanPageComponent', () => {
  let component: BusinessPlanPageComponent;
  let fixture: ComponentFixture<BusinessPlanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessPlanPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessPlanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
