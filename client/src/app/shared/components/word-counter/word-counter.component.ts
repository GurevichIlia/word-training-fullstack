import { WordCounterService } from './word-counter.service';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-word-counter',
  templateUrl: './word-counter.component.html',
  styleUrls: ['./word-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordCounterComponent implements OnInit {
  // totalCardsLearned$: Observable<number> = this.counterService.totalCardsLearned$()
  // learnedCardsFromGroup$: Observable<number> = this.counterService.getQuantityLearnedWords$();
  // wordsInGroup$: Observable<number> = this.counterService.getQuantityAllWords$();

  @Input() totalCardsLearned: number
  @Input() learnedCardsFromGroup: number
  @Input() wordsInGroup: number
  constructor() { }

  ngOnInit() {
  }

}
