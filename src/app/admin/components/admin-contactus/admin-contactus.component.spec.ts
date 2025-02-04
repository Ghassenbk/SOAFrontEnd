import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContactusComponent } from './admin-contactus.component';

describe('AdminContactusComponent', () => {
  let component: AdminContactusComponent;
  let fixture: ComponentFixture<AdminContactusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminContactusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminContactusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
