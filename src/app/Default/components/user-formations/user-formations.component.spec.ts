import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormationsComponent } from './user-formations.component';

describe('UserFormationsComponent', () => {
  let component: UserFormationsComponent;
  let fixture: ComponentFixture<UserFormationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFormationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
