import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { InstallAppService } from 'src/app/core/install-app/install-app.service';
import { InstallHelperFunctionsService } from 'src/app/core/install-app/install-helper-functions.service';
import { LEVEL_LIST } from 'src/app/core/models/vocabulary.model';
import { GeneralFacade } from 'src/app/general.facade';
import { ALL_WORDS_GROUP, GeneralState } from 'src/app/general.state';
import { GroupStatistics, KnowledgeLevel } from 'src/app/shared/components/group-statistics/group-statistics.component';
import { GeneralWord, Word, WordGroup } from 'src/app/shared/interfaces';
import { AskQuestionComponent } from 'src/app/shared/modals/ask-question/ask-question.component';
import { ApiWordsService } from 'src/app/shared/services/api/api-words.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { WordsService } from './../../core/services/words.service';





@Injectable({
  providedIn: 'root'
})
export class VocabularyFacade {
  private selectedGroup$ = new BehaviorSubject<WordGroup>(ALL_WORDS_GROUP);

  constructor(
    private generalState: GeneralState,
    private apiWords: ApiWordsService,
    private generalFacade: GeneralFacade,
    private dialogService: NbDialogService,
    private notification: NotificationsService,
    private installApp: InstallAppService,
    private installAppHelper: InstallHelperFunctionsService,
    private wordsService: WordsService
  ) {

  }


  // getAllUserWords$(): Observable<Word[]> {
  //   return this.wordsService.getAllUserWords$();
  // }

  getAllUserWords$(): Observable<Word[]> {
    return this.wordsService.getAllUserWords$();
  }

  getUserWordsFiltredByGroup(searchValue$: Observable<string>): Observable<Word[]> {
    return searchValue$.pipe(
      startWith(''),
      switchMap(searchValue => {
        return this.wordsService.filterBySearcValue(searchValue, this.wordsService.filterWordsByGroup(this.selectedGroup$.asObservable()));
      })
    );

  }

  filterBySearcValue(searchValue: string, words$: Observable<(Word | GeneralWord)[]>): Observable<Word[]> {
    return this.wordsService.filterBySearcValue(searchValue, words$);
  }

  // getWordsGroups$() {
  //   return this.generalState.getWordsGroups$();

  // }

  addNewWord(word: Word, selectedGroupId?: string) {
    const updatedWord = { ...word, assignedGroups: [ALL_WORDS_GROUP._id, selectedGroupId] };
    return this.generalFacade.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language =>
          this.apiWords.addWord(updatedWord, language)
        ));
  }



  updateWordsAndGroups() {
    this.wordsService.updateUsersWordList();
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
    const title = `
                  Would you like to remove word:
                   ${word.word} ?`;
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
    of([]);
  }

  // saveGroup(name: string, selectedGroup: WordGroup) {
  //   // const language = this.generalState.getCurrentLearningLanguage$();
  //   const groupId = selectedGroup ? selectedGroup._id : '';
  //   return this.generalState.getCurrentLearningLanguage$()
  //     .pipe(
  //       switchMap(language =>
  //         this.apiWords.saveGroup(name, language, groupId)
  //       ));
  // }

  // deleteWordGroup(groupId: string, groups: WordGroup[]) {
  //   const title = `Would you like to remove group ${groups.find(group => group._id === groupId).name} ?`;
  //   const result$ = this.askQuestion(title);

  //   return result$.onClose.pipe(
  //     switchMap(res => {
  //       if (res) {
  //         // this.vocabularyFacade.deleteWord(word);
  //         return this.apiWords.deleteWordGroup(groupId);
  //       } else {
  //         return EMPTY;
  //       }
  //     }),
  //   );

  // }

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

  getGroupStatistics(words$: Observable<Word[]>): Observable<GroupStatistics> {
    const statistics$: Observable<GroupStatistics> = words$
      .pipe(
        filter(words => words !== null && words !== undefined),
        map(words => {
          const knowledgeLevel: KnowledgeLevel[] = this.getKnowledgeLevel(words, LEVEL_LIST);

          return { knowledgeLevel };
        })
      );

    return statistics$;
  }

  private getQuntityWordsByLevel(words: Word[], level: number) {

    return words.length > 0 ? (words.filter(word => word.levelKnowledge === level)).length : 0;
  }

  getKnowledgeLevel(words: Word[], levelList: { color: string, level: number }[]): KnowledgeLevel[] {

    return levelList.map(item => {
      const knowledgeLevel: KnowledgeLevel = {
        level: item.level,
        color: item.color,
        wordQuantity: this.getQuntityWordsByLevel(words, item.level)
      };

      return knowledgeLevel;
    })

  }

  // addNewWordsFromCSV(file: File, selectedGroupId?: string) {
  //   if (!file) return EMPTY;

  //   if (!file.name.includes('csv')) {
  //     this.notification.info('Please select CSV file');
  //     return EMPTY;
  //   }

  //   const formData = new FormData();
  //   formData.append('csvFile', file, 'csvFile');

  //   return this.generalFacade.getCurrentLearningLanguage$()
  //     .pipe(
  //       switchMap(language => {
  //         const assignedGroups = JSON.stringify([ALL_WORDS_GROUP._id, selectedGroupId]);
  //         console.log('GROUPS', assignedGroups);
  //         return this.apiWords.addWordsFromCSV(formData, language, assignedGroups);
  //       }),
  //       catchError(err => {
  //         this.notification.error('Something went wrong, file was not uploaded');
  //         console.log('Uploading error', err);

  //         return EMPTY;
  //       }));
  // }
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

  getSelectedGroup$(): Observable<WordGroup> {
    return this.selectedGroup$.asObservable();
  }

  getSelectedGroup(): WordGroup {
    return this.selectedGroup$.getValue();
  }

  setSelectedGroup(group: WordGroup): void {
    this.selectedGroup$.next(group);
  }
}
