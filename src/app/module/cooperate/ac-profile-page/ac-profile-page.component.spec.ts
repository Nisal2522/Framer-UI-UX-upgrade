import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcProfilePageComponent } from './ac-profile-page.component';

describe('AcProfilePageComponent', () => {
  let component: AcProfilePageComponent;
  let fixture: ComponentFixture<AcProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcProfilePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
