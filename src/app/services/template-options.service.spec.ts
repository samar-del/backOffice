import { TestBed } from '@angular/core/testing';

import { TemplateOptionsService } from './template-options.service';

describe('TemplateOptionsService', () => {
  let service: TemplateOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
