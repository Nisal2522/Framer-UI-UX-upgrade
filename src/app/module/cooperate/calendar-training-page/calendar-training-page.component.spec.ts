import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarTrainingPageComponent } from './calendar-training-page.component';

describe('CalendarTrainingPageComponent', () => {
  let component: CalendarTrainingPageComponent;
  let fixture: ComponentFixture<CalendarTrainingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarTrainingPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarTrainingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
