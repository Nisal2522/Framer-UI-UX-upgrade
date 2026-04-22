import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { RoutePlaceholderComponent } from './route-placeholder.component';

describe('RoutePlaceholderComponent', () => {
  let component: RoutePlaceholderComponent;
  let fixture: ComponentFixture<RoutePlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutePlaceholderComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutePlaceholderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
