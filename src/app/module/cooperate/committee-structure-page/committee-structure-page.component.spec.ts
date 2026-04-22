import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeStructurePageComponent } from './committee-structure-page.component';

describe('CommitteeStructurePageComponent', () => {
  let component: CommitteeStructurePageComponent;
  let fixture: ComponentFixture<CommitteeStructurePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitteeStructurePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommitteeStructurePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
