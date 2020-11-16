import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAlertsComponent } from './group-alerts.component';

describe('GroupAlertsComponent', () => {
  let component: GroupAlertsComponent;
  let fixture: ComponentFixture<GroupAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupAlertsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
