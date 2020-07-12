import { GeneralFacade } from 'src/app/general.facade';
import { ApiWordsService } from './../shared/services/api/api-words.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, of, Observable } from 'rxjs';
import { startWith, switchMap, map } from 'rxjs/operators';
import { Word } from '../shared/interfaces';
import { ALL_WORDS_GROUP, FAVORITES } from '../vocabulary/vocabulary.facade';
import { GeneralState } from './../general.state';
import { VocabularyFacade } from './../vocabulary/vocabulary.facade';

@Injectable({
  providedIn: 'root'
})
export class WordTrainingService {
  // trainWords = new BehaviorSubject<Word[]>([]);
  // currentTrainWords$ = this.trainWords.asObservable();

  private trainingResult = new BehaviorSubject<Word[]>([]);
  currentTrainingResult$ = this.trainingResult.asObservable();
  constructor(
    private generalState: GeneralState,
    private vocabularyFacade: VocabularyFacade,
    private wordsApiService: ApiWordsService,
    private generalFacade: GeneralFacade
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


  setTrainResult(words: Word[]) {
    this.trainingResult.next(words);
  }

  getTrainResult() {
    return this.trainingResult.getValue();
  }

  getTrainResult$() {
    return this.currentTrainingResult$;
  }

  getWordGroups() {
    return this.vocabularyFacade.getWordsGroups();
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
      .map(word => word._id === wordId ? { ...word, levelKnowledge: level } : word);

    this.generalState.setUserWords(currentWords);
  }


  setSelectedGroupForTraining(groupId: string) {
    this.generalState.setSelectedGroupForTraining(groupId);
  }

  getSelectedGroupForTraining() {
    return this.generalState.getSelectedGroupForTraining();
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

          if (selectedGroupForTraining === ALL_WORDS_GROUP) {

            return of(words);

          } else if (selectedGroupForTraining === FAVORITES) {

            return this.vocabularyFacade.filterWordsByFavorite(of(words));

          } else {

            return of(words.filter(word => word.assignedGroups.includes(selectedGroupForTraining)))
          }

        })
      );
  }


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
    const allWords = this.generalState.getUserWords();

    return this.generalFacade.getCurrentLearningLanguage$()
      .pipe(
        switchMap(language => this.wordsApiService.updateWords(allWords, language))
      )

  }

  sortWordsForTraining(words: Word[]) {

  }


}
