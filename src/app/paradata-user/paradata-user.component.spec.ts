import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParadataUserComponent } from './paradata-user.component';

describe('ParadataUserComponent', () => {
  let component: ParadataUserComponent;
  let fixture: ComponentFixture<ParadataUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParadataUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParadataUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
