import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { NavigationService } from 'src/app/core';
import { GeneralFacade } from 'src/app/general.facade';
import { Word } from 'src/app/shared/interfaces';
import { assignWordsToGroupAction, closeAssigningBottomSheetAction } from 'src/app/store/actions/vocabulary.actions';
import { AppStateInterface } from 'src/app/store/reducers';
import { WordGroup } from './../../../shared/interfaces';
import {
  allWordsSelector,
  isBottomSheetLoadingSelector,
  isCloseWordsToAssignSelector,
  selectedGroupSelector
} from './../../../store/selectors/vocabulary.selectors';
import { AssignWordsService } from './../assign-words.service';
import { VocabularyFacade } from './../vocabulary.facade';

@Component({
  selector: 'app-assign-word-list',
  templateUrl: './assign-word-list.component.html',
  styleUrls: ['./assign-word-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignWordListComponent implements OnInit, OnDestroy {
  words$: Observable<Word[]>;
  selectedWords: string[] = [];
  subscription$ = new Subject();
  filterControl = new FormControl('');
  loading$: Observable<boolean>;
  isCloseBottomSheet$: Observable<boolean>
  goBackAnimation = false
  constructor(
    private assignService: AssignWordsService,
    private vocabularyFacade: VocabularyFacade,
    private store$: Store<AppStateInterface>,
    private _bottomSheetRef: MatBottomSheetRef<AssignWordListComponent>
  ) { }

  ngOnInit() {
    this.loading$ = this.store$.pipe(select(isBottomSheetLoadingSelector))
    this.isCloseBottomSheet$ = this.store$.pipe(
      select(isCloseWordsToAssignSelector),
      tap(_ => console.log('CLOSE SHEET', _)),
      filter(isClose => isClose === true),
      tap(_ => this._bottomSheetRef.dismiss()))


    this.getWords();
  }

  getWords() {
    this.words$ =
      this.store$.pipe(
        select(selectedGroupSelector),
        switchMap((selectedGroup: WordGroup) =>
          this.vocabularyFacade.removeWordsAlreadyExistInThisGroup(
            this.store$.pipe(select(allWordsSelector)), selectedGroup._id)),
      )


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

  assignWords(selectedWordsIds: string[]) {
    this.store$.dispatch(assignWordsToGroupAction({ selectedWordsIds }))



  }


  onClose() {
    this.store$.dispatch(closeAssigningBottomSheetAction())    // this.goBackAnimation = true
  }

  onScroll() {
    console.log('Scrolled');
  }

  ngOnDestroy(): void {

    this.subscription$.next();
    this.subscription$.complete();

  }
}
