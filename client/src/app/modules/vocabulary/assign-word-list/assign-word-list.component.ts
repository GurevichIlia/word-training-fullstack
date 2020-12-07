import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NavigationService } from 'src/app/core';
import { AppRoutes } from 'src/app/core/routes/routes';
import { GeneralFacade } from 'src/app/general.facade';
import { Word } from 'src/app/shared/interfaces';
import { assignWordsToGroupAction } from 'src/app/store/actions/groups.actions';
import { closeAssigningBottomSheetAction } from 'src/app/store/actions/words.actions';
import { AppStateInterface } from 'src/app/store/reducers';
import { WordGroup } from './../../../shared/interfaces';
import { allWordsSelector, isBottomSheetLoadingSelector, isCloseWordsToAssignSelector } from './../../../store/selectors/words.selectors';
import { AssignWordsService } from './../assign-words.service';
import { selectedGroupSelector } from './../groups/store/selectors/groups.selectors';
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
    private generalFacade: GeneralFacade,
    private assignService: AssignWordsService,
    private vocabularyFacade: VocabularyFacade,
    private navigation: NavigationService,

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
        // map(words => words.slice(0, 20))
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


    // const data = { groupId, selectedWords };
    // this.loading = true;
    // this.assignService.assignWords(data)
    //   .pipe(
    //     finalize(() => this.loading = false),
    //     takeUntil(this.subscription$)
    //   )
    //   .subscribe(res => {
    //     console.log('RES AFTER ASSIGN', res);
    //     this.generalFacade.updateWordList();
    //   });


  }

  // filterBySearchValue() {
  //   this.vocabularyFacade
  // }

  // closeDialog() {
  //   this.dialogRef.close()
  // }
  onClose() {
    this.store$.dispatch(closeAssigningBottomSheetAction())    // this.goBackAnimation = true
    // setTimeout(() =>
    //   this.navigation.navigateTo(AppRoutes.Vocabulary),
    //   100
    // )
  }

  onScroll() {
    console.log('Scrolled');
  }

  ngOnDestroy(): void {

    this.subscription$.next();
    this.subscription$.complete();

  }
}
