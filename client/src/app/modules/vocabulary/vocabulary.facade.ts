import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { DefaultGroupId, MenuItem, WordAction, wordMenuItems } from 'src/app/core';
import { InstallAppService } from 'src/app/core/install-app/install-app.service';
import { InstallHelperFunctionsService } from 'src/app/core/install-app/install-helper-functions.service';
import { GeneralFacade } from 'src/app/general.facade';
import { GroupStatisticsService } from 'src/app/shared/components/group-statistics/group-statistics.service';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { AskQuestionComponent } from 'src/app/shared/modals/ask-question/ask-question.component';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import {
  addWordToUserWordsAction,
  deleteUserGroupAction,
  deleteUserWordAction,
  deleteUserWordFromGroupAction,
  fetchWordsAction, saveEditedWordAction,
  selectVocabularyGroupAction
} from 'src/app/store/actions/vocabulary.actions';
import { AppStateInterface } from 'src/app/store/reducers';
import { allWordsSelector, selectedGroupSelector, vocabularyLoaderSelector } from 'src/app/store/selectors/vocabulary.selectors';
import { GeneralWord } from '../general-words/types/general-words.interfaces';
import { WordsService } from './../../core/services/words.service';
import { fetchGroupsAction } from './../../store/actions/vocabulary.actions';
import { groupsSelector } from './../../store/selectors/vocabulary.selectors';





@Injectable()
export class VocabularyFacade {
  constructor(
    private generalFacade: GeneralFacade,
    private dialogService: NbDialogService,
    private installApp: InstallAppService,
    private installAppHelper: InstallHelperFunctionsService,
    private wordsService: WordsService,
    private groupStatisticsService: GroupStatisticsService,
    private store$: Store<AppStateInterface>,
    private notification: NotificationsService,

  ) {

  }

  getGroupStatistics(words$: Observable<Word[]>) {
    return this.groupStatisticsService.getGroupStatistics(words$)
  }

  get groups$(): Observable<WordGroup[]> {
    return this.store$.pipe(
      select(groupsSelector)
    )
  }

  get words$(): Observable<Word[]> {
    return this.store$.pipe(
      select(allWordsSelector),
    )
  }

  get selectedGroup$(): Observable<WordGroup> {
    return this.store$.pipe(select(selectedGroupSelector))
  }

  get vocabularyLoader$(): Observable<boolean> {
    return this.store$.pipe(select(vocabularyLoaderSelector))

  }

  get wordMenuItems$(): Observable<MenuItem<WordAction>[]> {
    return this.selectedGroup$.pipe(
      filter(group => group !== null),
      map(group => {
        if (group._id === DefaultGroupId.ALL_WORDS || group._id === DefaultGroupId.FAVORITES) {
          return wordMenuItems.filter(item => item.action !== WordAction.DELETE_FROM_GROUP)
        }

        return wordMenuItems
      }))
  }

  fetchWordsAndGroups(): void {
    this.store$.dispatch(fetchWordsAction())
    this.store$.dispatch(fetchGroupsAction())
  }

  selectGroup(group: WordGroup): void {
    this.store$.dispatch(selectVocabularyGroupAction({ group }))
  }


  getUserWordsFiltredByGroup(
    searchValue: string,
    words: Word[],
    selectedGroup: WordGroup
  ): Word[] {
    const wordsFilteredByGroup = this.wordsService.filterWordsByGroup(selectedGroup, words)
    return this.wordsService.filterBySearcValue(searchValue, wordsFilteredByGroup)
  }

  filterBySearcValue(searchValue: string, words: (Word | GeneralWord)[]): Word[] {
    return this.wordsService.filterBySearcValue(searchValue, words);
  }


  addNewWord(wordForm: FormGroup) {
    if (wordForm.valid) {

      const word: Word = wordForm.value

      this.store$.dispatch(addWordToUserWordsAction({ word }))

    } else {
      this.notification.warning('', 'Please fill in required fields');
    }


    // const updatedWord = { ...word, assignedGroups: [ALL_WORDS_GROUP._id, selectedGroupId] };
    // return this.generalFacade.getCurrentLearningLanguage$()
    //   .pipe(
    //     switchMap(language =>
    //       this.apiWords.addWord(updatedWord, language)
    //     ));
  }

  updateWord(wordForm: FormGroup) {

    if (wordForm.valid) {

      const editedWord: Word = wordForm.value

      this.store$.dispatch(saveEditedWordAction({ word: editedWord }))

    } else {
      this.notification.warning('', 'Please fill in required fields');
    }

    // const words = this.generalState.getUserWords().map(existWord => existWord._id === word._id ? { ...existWord, ...word } : existWord);

    // this.generalState.setUserWords(words);
  }

  deleteWordFromGroup(word: Word): void {
    this.store$.dispatch(deleteUserWordFromGroupAction({ word }))
  }

  deleteWord(word: Word): void {
    this.store$.dispatch(deleteUserWordAction({ word }))

  }

  askQuestion(text: string) {
    const answer$ = this.dialogService.open(AskQuestionComponent, { context: { title: text }, hasBackdrop: true });
    return answer$;
  }

  removeWordsAlreadyExistInThisGroup(words$: Observable<Word[]>, groupId: string) {
    if (words$ && groupId) {
      return words$.pipe(
        tap(words => console.log('Words befor filter', words)),
        map(words => words.filter(word => !word.assignedGroups.includes(groupId))),
        tap(words => console.log('Words after filter', words)),

      )
    } else {
      return of([]);
    }

  }

  getWordsGroups() {
    return this.generalFacade.getWordsGroups();
  }

  showInstallPromotion(e?: Event) {
    this.installAppHelper.showInstallPromotion(e);
  }

  appIsInstalling() {
    return this.installApp.appIsInstalling();
  }

  detectDevice() {
    return this.installAppHelper.detectDevice();
  }


}
