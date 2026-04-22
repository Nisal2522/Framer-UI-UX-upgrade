import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { Member360FormPageComponent } from './member360-form-page.component';

describe('Member360FormPageComponent', () => {
  let component: Member360FormPageComponent;
  let fixture: ComponentFixture<Member360FormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Member360FormPageComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Member360FormPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
