import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';

import { WordTrainingService } from './word-training.service';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { NotificationsService } from 'src/app/shared/services/notifications.service';




@Component({
  selector: 'app-word-training',
  templateUrl: './word-training.component.html',
  styleUrls: ['./word-training.component.scss'],

})
export class WordTrainingComponent implements OnInit, OnDestroy {
  allWords$: Observable<Word[]> = this.wordTrainingService.getUserWords();
  start = false;
  loadingSpinner = false;

  trainingWordsQuantity: number;
  selectedTrainingGroupId$ = this.wordTrainingService.getSelectedGroupForTraining();
  currentOrderIndex$ = new BehaviorSubject<number>(0);
  currentTrainingWord$: Observable<Word>;
  wordGroups$: Observable<WordGroup[]>;
  priority = 0;
  previousWord$: Observable<Word>;
  constructor(
    private wordTrainingService: WordTrainingService,
    private router: Router,
    private notification: NotificationsService,
  ) {

  }

  // get selectedGroupForTraining$(): Observable<string> {
  //   return this.groupForTraining.valueChanges;
  // }

  get currentOrderIndex() {
    return this.currentOrderIndex$.getValue();
  }


  ngOnInit() {

    this.wordGroups$ = this.wordTrainingService.getWordGroups()
      .pipe(
        shareReplay(),
      );

    // this.getUserWords();
    // this.favoriteMode.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value: string) => {
    //   this.restartGame();
    //   if (value === 'all') {
    //     this.onClassicMode();
    //   } else if (value === 'favorites') {
    //     this.onFavoriteMode();
    //   }
    // });
  }

  // startTrain() {
  //   this.startAnimation('bounceInDown');
  //   this.start = true;
  //   this.getCurrentTrainingWord();

  // }


  // getCurrentTrainingWord() {
  //   this.currentTrainingWord$ = this.wordTrainingService.getWordByPriority(this.priority)
  //     .pipe(tap(() => {
  //       this.priority = this.priority + 1;
  //       if (this.priority === 6) {
  //         this.priority = 0;
  //       }
  //       console.log('INVOKE');
  //     }));


  //   // = combineLatest(
  //   //   [
  //   //     this.wordTrainingService.getFiltredWordsByGroup(),
  //   //     this.currentOrderIndex$,
  //   //   ]
  //   // )
  //   //   .pipe(
  //   //     map(([trainingWords, currentOrderIndex]) => {

  //   //       this.trainingWordsQuantity = trainingWords.length - 1;
  //   //       console.log('WORDS FOR TRAIN', trainingWords);
  //   //       return trainingWords[currentOrderIndex];
  //   //     }));
  // }

  setGroupForTraining(group: WordGroup) {
    // this.groupForTraining.patchValue(groupId);
    this.wordTrainingService.setSelectedGroupForTraining(group);
    this.currentOrderIndex$.next(0);
  }

  setWordKnowledgeLevel(wordId: string, level: number) {
    this.wordTrainingService.setWordKnowledgeLevel(wordId, level);
  }

  // nextWordAndSetWordLevel(payload: { wordId: string, level: number }) {
  //   this.nextWord();
  //   this.setWordKnowledgeLevel(payload.wordId, payload.level);
  // }

  // nextWord() {
  //   this.startAnimation('bounceInDown');

  //   // if (this.currentOrderIndex === this.trainingWordsQuantity) {
  //   //   this.currentOrderIndex$.next(0);
  //   // } else {
  //   //   this.currentOrderIndex$.next(this.currentOrderIndex + 1);
  //   // }
  //   this.previousWord$ = this.currentTrainingWord$;
  //   this.getCurrentTrainingWord();

  // }

  // prevWord() {
  //   this.startAnimation('bounceInLeft');
  //   this.currentTrainingWord$ = this.previousWord$;
  //   // console.log('works');
  //   // if (this.currentOrderIndex === 0) {
  //   //   this.currentOrderIndex$.next(this.trainingWordsQuantity);
  //   // } else {
  //   //   this.currentOrderIndex$.next(this.currentOrderIndex - 1);
  //   // }

  // }





  // getUserWords() {
  //   // if (localStorage.getItem('userData')) {
  //   //   // this.userWords = this.getWordFromLocalStorage();
  //   //   console.log('WORD TRAIN WORDS LOCAL STR', this.userWords);
  //   //   this.loadingSpinner = false;
  //   //   this.onClassicMode();
  //   // } else {
  //   this.vocabularyService.getCurrentWords$()
  //     .pipe(
  //       // tap(words => words.length === 0 ? this.router.navigate(['vocabulary']) : null),
  //       takeUntil(this.unsubscribe$))
  //     .subscribe((words: Word[]) => {
  //       if (words !== null) {
  //         this.userWords = words;

  //         // if (this.userWords.length === 0) {
  //         //   this.router.navigate(['vocabulary']);
  //         //   return;
  //         // }
  //         this.favoritesWordsQuantity = 0;
  //         this.userWords.map(word => word.isFavorite === true ? this.favoritesWordsQuantity++ : word);
  //         console.log('WORD TRAIN WORDS', this.userWords);
  //         console.log('SUBSCRIBE', this.wordTrainingService.getUserWords());
  //         if (this.start === false) {
  //           this.onClassicMode();
  //         }
  //       } else {
  //         console.log('Update data');
  //       }
  //       this.loadingSpinner = false;
  //     });
  //   // }

  // }
  // getWordFromLocalStorage() {
  //   return JSON.parse(localStorage.getItem('userData')).words;
  // }

  // onFavoriteMode() {
  //   this.startAnimation('bounceInDown');
  //   this.wordsFiltredByMode = this.userWords.filter((word: Word) => word.isFavorite === true);
  //   this.getRandomWords(this.wordsFiltredByMode);
  //   this.wordIndex = 0;
  //   this.unknownMode = false;
  // }

  // onClassicMode() {
  //   this.startAnimation('bounceInDown');
  //   this.wordsFiltredByMode = this.userWords.filter((word: Word) => word);
  //   this.getRandomWords(this.wordsFiltredByMode);
  //   this.wordIndex = 0;
  //   this.unknownMode = false;
  // }

  // unknownWordMode(words: Word[]) {
  //   this.start = true;
  //   this.unknownMode = true;
  //   this.startAnimation('bounceInDown');
  //   this.wordsFiltredByMode = words;
  //   this.getRandomWords(this.wordsFiltredByMode);
  //   this.wordIndex = 0;
  //   this.favoriteMode.patchValue('unknown');
  // }

  // dontKnow(word: Word) {
  //   this.startAnimation('bounceOutUp');
  //   // this.startAnimation('bounceInRight');
  //   const notKnownWord = Object.assign({}, word);
  //   notKnownWord.knowen = false;
  //   this.wordTrainingService.addWordToResultWords(this.wordsForResult, notKnownWord);
  //   setTimeout(() => {
  //     this.addToFavorites(word);
  //     this.nextWord();
  //     this.notknownWords++;
  //   }, 300);
  // }

  // onKnow(word: Word) {
  //   const knownWord = Object.assign({}, word);
  //   knownWord.knowen = true;
  //   this.wordTrainingService.addWordToResultWords(this.wordsForResult, knownWord);
  //   this.startAnimation('bounceInRight');
  //   console.log('know');
  //   this.nextWord();
  //   this.knownWords++;
  // }

  // restartGame() {
  //   this.notknownWords = 0;
  //   this.knownWords = 0;
  //   this.clearWordsForResult();
  // }

  // setFavorite(word: Word) {

  //   this.vocabularyService.editWord(word)
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe(res => {
  //       console.log(res);
  //     }, err => this.notification.error('', err.error.message))
  //     ;


  // }

  // addToFavorites(word: Word) {
  //   console.log('add to fav');
  //   if (word.isFavorite === false) {
  //     word.isFavorite = true;
  //     this.setFavorite(word);
  //   }
  // }

  // removeFromFavorites(word: Word) {
  //   console.log('remove to fav');
  //   if (word.isFavorite === true) {
  //     word.isFavorite = false;
  //     this.setFavorite(word);

  //     this.vocabularyService.editWord(word);
  //   }
  // }



  goToTrainResult() {
    // this.wordTrainingService.setTrainResult(this.wordsForResult);
    this.router.navigate(['train-result']);
  }

  // getTrainWords() {
  //   this.wordTrainingService.getTrainWords$()
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((data: Word[]) => {
  //       if (data.length !== 0) {
  //         this.unknownWordMode(data);
  //       }
  //     });
  // }
  // clearWordsForResult() {
  //   this.wordsForResult = [];
  // }
  // setDefaultMode() {
  //   this.favoriteMode.patchValue('all');
  // }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    // console.log(this.favoriteMode.value);


    this.wordTrainingService.clearCounterState();
    // this.unsubscribe$.next();
    // this.unsubscribe$.complete();
  }
}