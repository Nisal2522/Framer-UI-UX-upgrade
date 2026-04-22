import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommuneVerificationPageComponent } from './commune-verification-page.component';

describe('CommuneVerificationPageComponent', () => {
  let component: CommuneVerificationPageComponent;
  let fixture: ComponentFixture<CommuneVerificationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommuneVerificationPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommuneVerificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
