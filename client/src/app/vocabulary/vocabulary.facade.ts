import { InstallHelperFunctionsService } from './../core/install-app/install-helper-functions.service';
import { WordGroup } from './../shared/interfaces';
import { GeneralWord } from './../../../../src/interfaces';
import { NotificationsService } from './../shared/services/notifications.service';
import { NbDialogService } from '@nebular/theme';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, EMPTY } from 'rxjs';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import { GeneralState } from '../general.state';
import { Word } from '../shared/interfaces';
import { ApiWordsService } from './../shared/services/api/api-words.service';
import { AskQuestionComponent } from '../shared/modals/ask-question/ask-question.component';
import { InstallAppService } from '../core/install-app/install-app.service';

export const ALL_WORDS = '1';
export const FAVORITES = '2';
@Injectable({
  providedIn: 'root'
})
export class VocabularyFacade {
  constructor(
    private generalState: GeneralState,
    private apiWords: ApiWordsService,
    private generalFacade: GeneralFacade,
    private dialogService: NbDialogService,
    private notification: NotificationsService,
    private installApp: InstallAppService,
    private installAppHelper: InstallHelperFunctionsService
  ) {

  }


  getAllUserWords$() {
    return this.generalState.getUserWords$()
      .pipe(
        filter(words => words !== null)
      );
  }

  getUserWordsFiltredByGroup(selectedGroup$: Observable<string>, searchValue$: Observable<string>) {
    return combineLatest([selectedGroup$.pipe(startWith(ALL_WORDS)), searchValue$.pipe(startWith(''))])
      .pipe(
        switchMap(([groupId, searchValue]) => {

          if (groupId === ALL_WORDS) {

            return this.filterBySearcValue(searchValue, this.getAllUserWords$());

          } else if (groupId === FAVORITES) {

            return this.filterBySearcValue(searchValue, this.filterWordsByFavorite(this.getAllUserWords$()));

          } else {

            return this.filterBySearcValue(searchValue, this.getAllUserWords$()
              .pipe(
                map(words => words.filter(word => word.assignedGroups.includes(groupId)))
              ))
          }

        }),
        // map(words => words.reverse()),
        tap(res => console.log('WORDS', res))

      )
  }

  filterBySearcValue(searchValue: string, words: Observable<(Word | GeneralWord)[]>) {
    return words
      .pipe(
        map(wordsForFilter => {

          if (searchValue) {

            return wordsForFilter.filter(word => word.word.toLowerCase().includes(searchValue.toLowerCase()) ||
              word.translation.toLowerCase().includes(searchValue.toLowerCase()));

          } else {

            return wordsForFilter;

          }
        }));
  }

  getWordsGroups$() {
    return this.generalState.getWordsGroups$();

  }

  filterWordsByFavorite(allWords: Observable<Word[]>) {
    return allWords.pipe(
      map(words => words.filter(word => word.isFavorite))
    );
  }

  addNewWord(word: Word) {
    return this.generalFacade.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language =>
          this.apiWords.addWord(word, language)
        ));
  }

  updateWordsAndGroups() {
    this.generalFacade.updateWordList();
  }

  isUpdateGroups() {
    return this.generalFacade.isUpdateWordList$();
  }

  editWord(word: Word) {
    return this.generalFacade.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language =>
          this.apiWords.editWord(word, language)
        ));

  }

  deleteWordFromServer(word: Word) {
    const title = `Would you like to remove word ${word.word} ?`;
    const result$ = this.askQuestion(title);

    return result$.onClose.pipe(
      switchMap(res => {
        if (res) {
          // this.vocabularyFacade.deleteWord(word);
          return this.apiWords.deleteWordFromServer(word._id);
        } else {
          return EMPTY;
        }
      }),
    );

    // return this.apiWords.deleteWordFromServer(wordId);

  }

  assignGroup() {
    // return this.http.post<Word>(`/api/word-group/assign-group`, { groupId, selectedWords });
    of([])
  }

  createWordGroup(name: string,) {
    // const language = this.generalState.getCurrentLearningLanguage$();
    return this.generalState.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language =>
          this.apiWords.createWordGroup(name, language)
        ));
  }

  deleteWordGroup(groupId: string, groups: WordGroup[]) {
    const title = `Would you like to remove group ${groups.find(group => group._id === groupId).name} ?`;
    const result$ = this.askQuestion(title);

    return result$.onClose.pipe(
      switchMap(res => {
        if (res) {
          // this.vocabularyFacade.deleteWord(word);
          return this.apiWords.deleteWordGroup(groupId);
        } else {
          return EMPTY;
        }
      }),
    );

  }

  updateWord(word: Word) {
    const words = this.generalState.getUserWords().map(existWord => existWord._id === word._id ? { ...existWord, ...word } : existWord);

    this.generalState.setUserWords(words);
  }


  askQuestion(text: string) {
    const answer$ = this.dialogService.open(AskQuestionComponent, { context: { title: text }, hasBackdrop: true });
    return answer$;
  }


  addWordsToGeneralList(words: Word[]) {
    return this.generalFacade.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language =>
          this.apiWords.addWordsToGeneralList(words, language)
            .pipe(
              tap(res => console.log('AFTER SHARE', res)),
              tap(res => this.notification.success('Shared'))
            )
        ));



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

  // showInstallSuggestion(e: Event) {
  //   this.installApp.showInstallSuggestion(e);
  // }
  showInstallPromotion(e?: Event) {
    this.installAppHelper.showInstallPromotion(e);
  }

  appIsInstalling() {
    return this.installApp.appIsInstalling();
  }

  detectDevice() {
    return this.installAppHelper.detectDevice();
  }
  // parseText(oldWords: string) {
  //   const language = this.generalState.getCurrentLearningLanguage();

  //   const words = JSON.parse(oldWords);

  //   const mapedWords = words.map(word =>
  //     ({
  //       word: word.word,
  //       translation: word.translate,
  //       language: language._id.trim(),
  //       isFavorite: false,
  //       levelKnowledge: 0,
  //       assignedGroups: ['1']
  //     }));

  //   console.log(mapedWords);
  //   this.apiWords.addWords(mapedWords)
  //     .subscribe();
  // }
}
