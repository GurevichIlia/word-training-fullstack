import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import { GeneralWord, WordGroup, Word } from 'src/app/shared/interfaces';
import { GeneralState, ALL_WORDS_GROUP, FAVORITES } from 'src/app/general.state';
import { ApiWordsService } from 'src/app/shared/services/api/api-words.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { InstallAppService } from 'src/app/core/install-app/install-app.service';
import { InstallHelperFunctionsService } from 'src/app/core/install-app/install-helper-functions.service';
import { AskQuestionComponent } from 'src/app/shared/modals/ask-question/ask-question.component';
import { GroupStatistics, KnowledgeLevel } from 'src/app/shared/components/group-statistics/group-statistics.component';



const LEVEL_LIST = [
  { color: 'whitesmoke', level: 0 },
  { color: '#6c7bec', level: 5 },
  { color: '#81db64db', level: 4 },
  { color: '#f4e25f', level: 3 },
  { color: '#ff7f24bf', level: 2 },
  { color: '#e81a1ac2', level: 1 },
]

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

  getUserWordsFiltredByGroup(selectedGroup$: Observable<WordGroup>, searchValue$: Observable<string>) {
    return combineLatest([selectedGroup$.pipe(startWith(ALL_WORDS_GROUP)), searchValue$.pipe(startWith(''))])
      .pipe(
        switchMap(([group, searchValue]) => {
          if (group._id === ALL_WORDS_GROUP._id) {

            return this.filterBySearcValue(searchValue, this.getAllUserWords$());

          } else if (group._id === FAVORITES._id) {

            return this.filterBySearcValue(searchValue, this.generalFacade.filterWordsByFavorite(this.getAllUserWords$()));

          } else {

            return this.filterBySearcValue(searchValue, this.getAllUserWords$()
              .pipe(
                map(words => words.filter(word => word.assignedGroups.includes(group._id)))
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

  addNewWord(word: Word, selectedGroupId?: string) {
    const updatedWord = { ...word, assignedGroups: [ALL_WORDS_GROUP._id, selectedGroupId] };
    return this.generalFacade.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language =>
          this.apiWords.addWord(updatedWord, language)
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

  deleteWordFromServer(word: Word, index: number) {
    const title = `Would you like to remove word ${word.word} ?`;
    const result$ = this.askQuestion(title);

    return result$.onClose.pipe(
      switchMap(res => {
        if (res) {
          // this.vocabularyFacade.deleteWord(word);
          return this.apiWords.deleteWordFromServer(index);
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

  saveGroup(name: string, selectedGroup: WordGroup) {
    // const language = this.generalState.getCurrentLearningLanguage$();
    const groupId = selectedGroup ? selectedGroup._id : '';
    return this.generalState.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language =>
          this.apiWords.saveGroup(name, language, groupId)
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

  getGroupStatistics(words$: Observable<Word[]>): Observable<GroupStatistics> {
    const statistics$: Observable<GroupStatistics> = words$
      .pipe(
        filter(words => words !== null && words !== undefined),
        map(words => {
          const knowledgeLevel: KnowledgeLevel[] = this.getKnowledgeLevel(words, LEVEL_LIST);

          return { knowledgeLevel }
        })
      );

    return statistics$;
  }

  private getQuntityWordsByLevel(words: Word[], level: number) {

    return words.length > 0 ? (words.filter(word => word.levelKnowledge === level)).length : 0;
  }

  getKnowledgeLevel(words: Word[], levelList: { color: string, level: number }[]): KnowledgeLevel[] {

    return levelList.map(item => {
      const lnowledgeLevel: KnowledgeLevel = {
        level: item.level,
        color: item.color,
        wordQuantity: this.getQuntityWordsByLevel(words, item.level)
      };

      return lnowledgeLevel;
    })

  }

  addNewWordsFromCSV(file: File, selectedGroupId?: string) {
    if (!file) return EMPTY;

    if (!file.name.includes('csv')) {
      this.notification.info('Please select CSV file');
      return EMPTY;
    }

    const formData = new FormData();
    formData.append('csvFile', file, 'csvFile');

    return this.generalFacade.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language => {
          const assignedGroups = JSON.stringify([ALL_WORDS_GROUP._id, selectedGroupId]);
          console.log('GROUPS', assignedGroups)
          return this.apiWords.addWordsFromCSV(formData, language, assignedGroups);
        }));
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
