import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoopWeekCalendarComponent } from './coop-week-calendar.component';

describe('CoopWeekCalendarComponent', () => {
  let component: CoopWeekCalendarComponent;
  let fixture: ComponentFixture<CoopWeekCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoopWeekCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoopWeekCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
