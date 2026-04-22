import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeManagementPageComponent } from './knowledge-management-page.component';

describe('KnowledgeManagementPageComponent', () => {
  let component: KnowledgeManagementPageComponent;
  let fixture: ComponentFixture<KnowledgeManagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowledgeManagementPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('filters materials by search term', () => {
    component.searchTerm.set('Irrigation');
    expect(component.filteredMaterials().length).toBe(1);
  });

  it('toggles tag selection', () => {
    component.toggleTag('Rice');
    expect(component.selectedTags()).toContain('Rice');
    component.toggleTag('Rice');
    expect(component.selectedTags()).not.toContain('Rice');
  });
});
