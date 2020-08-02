import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { GeneralFacade } from 'src/app/general.facade';
import { WordGroup, Word } from 'src/app/shared/interfaces';

import { WordCounterService } from './word-counter/word-counter.service';
import { GeneralState, ALL_WORDS_GROUP, FAVORITES } from 'src/app/general.state';
import { ApiWordsService } from 'src/app/shared/services/api/api-words.service';

@Injectable({
  providedIn: 'root'
})
export class WordTrainingService {
  // trainWords = new BehaviorSubject<Word[]>([]);
  // currentTrainWords$ = this.trainWords.asObservable();
  private _isStarted$ = new BehaviorSubject<boolean>(false);

  private _currentTrainingWord$: Observable<Word>
  private _previousWord$: Observable<Word>;

  priority = 0;
  animationState$ = new BehaviorSubject('');
  constructor(
    private generalState: GeneralState,
    // private vocabularyFacade: VocabularyFacade,
    private wordsApiService: ApiWordsService,
    private generalFacade: GeneralFacade,
    private router: Router,
    private counterService: WordCounterService
  ) {
  }
  getUserWords() {
    return this.generalState.getUserWords$();
  }

  getRandomOrder(words?: Word[]) {
    for (let i = words.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * words.length);
      const temp = words[i];
      words[i] = words[j]
      words[j] = temp;
    }
    return words;
  }

  addWordToResultWords(resultWords: Word[], word: Word) {
    resultWords.push(word);
    return resultWords;
  }

  getWordGroups() {
    return this.generalFacade.getWordsGroups();
  }
  // setTrainWords(words: Word[]) {
  //   this.trainWords.next(words);
  // }

  // getTrainWords() {
  //   return this.trainWords.getValue();
  // }

  // getTrainWords$() {
  //   return this.currentTrainWords$;

  // }

  setWordKnowledgeLevel(wordId: string, level: number) {
    const currentWords = this.generalState.getUserWords()
      .map(word => {
        if (word._id === wordId) {
          const updatedWord = { ...word, levelKnowledge: level };
          this.counterService.addWordToTrainResult(updatedWord);
          return updatedWord;
        } else {
          return word;
        }
      });

    this.generalState.setUserWords(currentWords);
  }


  setSelectedGroupForTraining(group: WordGroup) {
    this.generalState.setSelectedGroupForTraining(group);
  }

  getSelectedGroupForTraining() {
    return this.generalState.getSelectedGroupForTraining$();
  }

  getFiltredWordsByGroup() {
    return combineLatest(
      [
        this.getUserWords().pipe(startWith([] as Word[])),
        this.getSelectedGroupForTraining()
      ]
    )
      .pipe(
        switchMap(([words, selectedGroupForTraining]) => {

          if (selectedGroupForTraining._id === ALL_WORDS_GROUP._id) {

            return of(words);

          } else if (selectedGroupForTraining._id === FAVORITES._id) {

            return this.generalFacade.filterWordsByFavorite(of(words));

          } else {

            return of(words.filter(word => word.assignedGroups.includes(selectedGroupForTraining._id)))
          }

        })
      );
  }

  showNextTrainingWord() {
    this._currentTrainingWord$ = this.getWordByPriority(this.priority)
      .pipe(tap(() => {
        this.priority = this.priority + 1;
        if (this.priority === 6) {
          this.priority = 0;
        }
        console.log('INVOKE');
      }));

  }

  getCurrentTrainingWord$() {
    return this._currentTrainingWord$;
  }
  // setCurrentTrainingWord(word: Word) {
  //   this._currentTrainingWord$.next(word);
  // }

  getWordByPriority(priority: number) {
    if (priority === 0 || priority === 1 || priority === 4 || priority === 3 || priority === 6) {

      // tslint:disable-next-line: max-line-length
      return this.getFiltredWordsByGroup().pipe(
        map(words => {
          // tslint:disable-next-line: max-line-length

          const randomLevelKnowledge = Math.floor(Math.random() * 4);
          console.log('RANDOM', randomLevelKnowledge);

          const firstPriority = words.filter(word => word.levelKnowledge === randomLevelKnowledge);
          // console.log('PRIORITY:', priority)
          // console.log('LEVEL KNOwLEDGE:', randomLevelKnowledge)
          // console.log('WORDS:', firstPriority)
          if (firstPriority.length !== 0) {
            const index = Math.floor(Math.random() * firstPriority.length);
            return firstPriority[index];

          } else {
            const index = Math.floor(Math.random() * words.length);

            return words[index];
          }

        }));




    } else {
      // tslint:disable-next-line: max-line-length

      return this.getFiltredWordsByGroup().pipe(
        map(words => {
          // tslint:disable-next-line: max-line-length
          const secondPriority = words.filter(word => word.levelKnowledge === 2 || word.levelKnowledge === 5);
          // console.log('PRIORITY:', priority)
          // console.log('LEVEL KNOwLEDGE:', 2, 5)
          // console.log('WORDS:', secondPriority)
          if (secondPriority.length !== 0) {
            const index = Math.floor(Math.random() * secondPriority.length);
            return secondPriority[index];

          } else {
            const index = Math.floor(Math.random() * words.length);

            return words[index];
          }
        }));




      // // tslint:disable-next-line: max-line-length
      // if (words[index].levelKnowledge === 4 || words[index].levelKnowledge === 5) {
      //   return words[index];
      // } else {
      //   const word = this.getWordByPriority(priority);
      //   return word;
      // }


    }


  }


  updateWords() {
    const selectedGroupForTraining = this.generalState.getSelectedGroupForTraining();
    const words = this.generalState.getUserWords();
    // .filter(word => word.assignedGroups.includes(selectedGroupForTraining._id));

    return this.generalFacade.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language => this.wordsApiService.updateWords(words, language))
      );
  }

  sortWordsForTraining(words: Word[]) {

  }

  onStartTraining() {
    this._isStarted$.next(true);
    this.router.navigate(['word-training/basic']);
    this.startAnimation('bounceInDown');
    this.showNextTrainingWord();
  }

  onFinishTraining() {
    this._isStarted$.next(false);
  }

  isStart$() {
    return this._isStarted$.asObservable();
  }

  isBlockStart() {
    const isBlockStart$: Observable<boolean> = this.getSelectedGroupForTraining()
      .pipe(
        switchMap(selectedGroup => {
          return this.getWordGroups()
            .pipe(
              map(groups => groups.find(group => group._id === selectedGroup._id)),
              map(group => group.wordQuantity < 5)
            )
        }));

    return isBlockStart$;
  }


  startAnimation(stateAnimate) {
    console.log(stateAnimate);
    // if (!this.animationState) {
    //   this.animationState = stateAnimate;
    // }
    if (!this.animationState$.getValue()) {
      this.animationState$.next(stateAnimate)
    }
  }

  resetAnimationState() {
    // this.animationState = '';
    this.animationState$.next('')

  }

  getAnimationState() {
    return this.animationState$.asObservable();
  }

  nextWord(word: Word, level: number) {
    this.startAnimation('bounceInDown');
    this.setWordKnowledgeLevel(word._id, level);
    this._previousWord$ = this._currentTrainingWord$;
    this.showNextTrainingWord();

  }

  prevWord() {
    this.startAnimation('bounceInLeft');
    this._currentTrainingWord$ = this._previousWord$;

  }

  clearCounterState() {
    this.counterService.clearCounterState();
  }

  favoriteToggle(word: Word) {
    const newWord = { ...word, isFavorite: !word.isFavorite };
    return this.generalState.getCurrentLearningLanguage$().pipe(switchMap(language => this.wordsApiService.editWord(newWord, language)));
  }
  // onSetKnowledgeLevel(wordId: string, level: number) {
  //   this.setKnowledgeLevel.emit({ wordId, level });
  // }

  // setWordKnowledgeLevel(wordId: string, level: number) {
  //   this.wordTrainingService.setWordKnowledgeLevel(wordId, level);
  // }

  // nextWordAndSetWordLevel(payload: { wordId: string, level: number }) {
  //   this.nextWord();
  //   this.setWordKnowledgeLevel(payload.wordId, payload.level);
  // }
}
