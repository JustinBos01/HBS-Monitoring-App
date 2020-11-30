import { TestBed } from '@angular/core/testing';

import { GroupOverviewService } from './group-overview.service';

describe('GroupOverviewService', () => {
  let service: GroupOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
