import { WordTrainingService } from './../word-training.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-select-group',
  templateUrl: './select-group.component.html',
  styleUrls: ['./select-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectGroupComponent implements OnInit {
  isStart$ = this.wordTrainingService.isStart$();
  wordGroups$ = this.wordTrainingService.getWordGroups()
    .pipe(
      tap(groups => groups ? this.wordTrainingService.setSelectedGroupForTraining(groups[0]) : null));
  isBlockStart$ = this.wordTrainingService.isBlockStart();
  selectedTrainingGroup$ = this.wordTrainingService.getSelectedGroupForTraining().pipe(tap(g => console.log('SELECTED GROUP', g)));
  constructor(public wordTrainingService: WordTrainingService) { }

  ngOnInit() {

  }

}
