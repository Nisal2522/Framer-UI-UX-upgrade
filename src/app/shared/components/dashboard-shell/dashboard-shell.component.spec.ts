import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { DashboardShellComponent } from './dashboard-shell.component';

describe('DashboardShellComponent', () => {
  let component: DashboardShellComponent;
  let fixture: ComponentFixture<DashboardShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardShellComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardShellComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
