import { GeneralFacade } from 'src/app/general.facade';
import { takeUntil } from 'rxjs/operators';
import { AssignWordsService } from './../assign-words.service';
import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Word } from 'src/app/shared/interfaces';
import { Observable, Subject } from 'rxjs';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-assign-word-list',
  templateUrl: './assign-word-list.component.html',
  styleUrls: ['./assign-word-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignWordListComponent implements OnInit, OnDestroy {
  @Input() words$: Observable<Word[]>;
  @Input() group: string;
  selectedWords = [];
  subscription$ = new Subject();
  constructor(
    protected dialogRef: NbDialogRef<AssignWordListComponent>,
    private generalFacade: GeneralFacade,
    private assignService: AssignWordsService) { }

  ngOnInit() {

  }

  getAction({ action, payload }) {
    if (action === 'assign') {
      this.selectWordForAssign(payload);
    }
  }

  selectWordForAssign(wordsId: string) {
    this.selectedWords = this.assignService.selectWordForAssign(wordsId, this.selectedWords);
    console.log('SELECTED WORDS', this.selectedWords);

  }

  assignWords(groupId: string, selectedWords: string[]) {
    const data = { groupId, selectedWords };

    this.assignService.assignWords(data)
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe(res => {
        console.log('RES AFTER ASSIGN', res);
        this.generalFacade.updateWordList();
        this.dialogRef.close();
      });


  }

  ngOnDestroy(): void {

    this.subscription$.next();
    this.subscription$.complete();

  }
}
