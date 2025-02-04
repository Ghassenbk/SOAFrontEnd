import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSolutionsComponent } from './admin-solutions.component';

describe('AdminSolutionsComponent', () => {
  let component: AdminSolutionsComponent;
  let fixture: ComponentFixture<AdminSolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSolutionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
