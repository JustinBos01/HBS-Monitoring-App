import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParadataGraphPageComponent } from './paradata-graph-page.component';

describe('ParadataGraphPageComponent', () => {
  let component: ParadataGraphPageComponent;
  let fixture: ComponentFixture<ParadataGraphPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParadataGraphPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParadataGraphPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
