import { VocabularyFacade } from './../vocabulary.facade';
import { GeneralFacade } from 'src/app/general.facade';
import { takeUntil, switchMap, startWith, map, tap, finalize } from 'rxjs/operators';
import { AssignWordsService } from './../assign-words.service';
import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Word } from 'src/app/shared/interfaces';
import { Observable, Subject, of } from 'rxjs';
import { NbDialogRef } from '@nebular/theme';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-assign-word-list',
  templateUrl: './assign-word-list.component.html',
  styleUrls: ['./assign-word-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignWordListComponent implements OnInit, OnDestroy {
  words$: Observable<Word[]>;
  @Input() group: string;
  selectedWords = [];
  subscription$ = new Subject();
  filterControl = new FormControl('');
  loading = false;
  constructor(
    protected dialogRef: NbDialogRef<AssignWordListComponent>,
    private generalFacade: GeneralFacade,
    private assignService: AssignWordsService,
    private vocabularyFacade: VocabularyFacade
  ) { }

  ngOnInit() {
    this.getWords();
  }

  getWords() {
    this.words$ = this.filterControl.valueChanges
      .pipe(
        startWith(''),
        switchMap(value =>
          this.vocabularyFacade.filterBySearcValue(
            value,
            this.vocabularyFacade.removeWordsAlreadyExistInThisGroup(this.vocabularyFacade.getAllUserWords$(), this.group)
          ))) as Observable<Word[]>;
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
    this.loading = true;
    this.assignService.assignWords(data)
      .pipe(
        finalize(() => this.loading = false),
        takeUntil(this.subscription$)
      )
      .subscribe(res => {
        console.log('RES AFTER ASSIGN', res);
        this.generalFacade.updateWordList();
        this.dialogRef.close();
      });


  }

  filterBySearchValue() {
    this.vocabularyFacade
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onScroll() {
    console.log('Scrolled');
  }
  ngOnDestroy(): void {

    this.subscription$.next();
    this.subscription$.complete();

  }
}
