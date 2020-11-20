import { TestBed } from '@angular/core/testing';

import { GroupPageService } from './group-page.service';

describe('GroupPageService', () => {
  let service: GroupPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
