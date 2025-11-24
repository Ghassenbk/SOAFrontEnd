import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFournisseursComponent } from './admin-fournisseurs.component';

describe('AdminFournisseursComponent', () => {
  let component: AdminFournisseursComponent;
  let fixture: ComponentFixture<AdminFournisseursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFournisseursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFournisseursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
