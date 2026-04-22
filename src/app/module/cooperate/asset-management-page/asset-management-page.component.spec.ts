import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetManagementPageComponent } from './asset-management-page.component';

describe('AssetManagementPageComponent', () => {
  let component: AssetManagementPageComponent;
  let fixture: ComponentFixture<AssetManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetManagementPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
