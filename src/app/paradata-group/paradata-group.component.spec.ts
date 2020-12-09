import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParadataGroupComponent } from './paradata-group.component';

describe('ParadataGroupComponent', () => {
  let component: ParadataGroupComponent;
  let fixture: ComponentFixture<ParadataGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParadataGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParadataGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
