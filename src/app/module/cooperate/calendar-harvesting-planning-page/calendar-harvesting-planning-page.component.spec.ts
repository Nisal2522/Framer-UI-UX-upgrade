import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarHarvestingPlanningPageComponent } from './calendar-harvesting-planning-page.component';

describe('CalendarHarvestingPlanningPageComponent', () => {
  let component: CalendarHarvestingPlanningPageComponent;
  let fixture: ComponentFixture<CalendarHarvestingPlanningPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarHarvestingPlanningPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarHarvestingPlanningPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
