import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAlertsComponent } from './user-alerts.component';

describe('UserAlertsComponent', () => {
  let component: UserAlertsComponent;
  let fixture: ComponentFixture<UserAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAlertsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
