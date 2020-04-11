import { TestBed, async, inject } from '@angular/core/testing';

import { SelectLanguageGuardGuard } from './select-language-guard.guard';

describe('SelectLanguageGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectLanguageGuardGuard]
    });
  });

  it('should ...', inject([SelectLanguageGuardGuard], (guard: SelectLanguageGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
