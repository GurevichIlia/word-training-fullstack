import { TestBed, async, inject } from '@angular/core/testing';

import { WordsTrainGuard } from './words-train.guard';

describe('WordsTrainGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordsTrainGuard]
    });
  });

  it('should ...', inject([WordsTrainGuard], (guard: WordsTrainGuard) => {
    expect(guard).toBeTruthy();
  }));
});
