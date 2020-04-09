import { NotificationsService } from './../shared/services/notifications.service';
import { VocabularyService } from './../vocabulary/vocabulary.service';
import { WordTrainingService } from './word-training.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, FormBuilder } from '@angular/forms';



import { trigger, state, keyframes, animate, transition } from '@angular/animations';
import * as kf from '../shared/keyframes';
import { Word } from '../shared/interfaces';
import { Router } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-word-training',
  templateUrl: './word-training.component.html',
  styleUrls: ['./word-training.component.scss'],
  animations: [
    trigger('wordCardAnimator', [
      transition('* => bounceInRight', animate(500, keyframes(kf.bounceInRight))),
      transition('* => bounceOutUp', animate(500, keyframes(kf.bounceOutUp))),
      transition('* => bounceInDown', animate(500, keyframes(kf.bounceInDown))),
      transition('* => bounceInLeft', animate(500, keyframes(kf.bounceInLeft)))

    ])
  ]
})
export class WordTrainingComponent implements OnInit, OnDestroy {
  @ViewChild('flipCard', { read: true, static: true }) flipCard: ElementRef;
  unsubscribe$ = new Subject();
  userWords: Word[] = [];
  userRandomWords: Word[] = [];
  wordsFiltredByMode: Word[] = [];
  start = false;
  favoriteMode: FormControl;
  loadingSpinner = true;
  knownWords = 0;
  notknownWords = 0;
  wordIndex = 0;
  favoritesWordsQuantity = 0;
  animationState: string;
  wordsForResult: Word[] = [];
  unknownMode = false;
  constructor(
    private wordTrainingService: WordTrainingService,
    private vocabularyService: VocabularyService,
    private fb: FormBuilder,
    private router: Router,
    private notification: NotificationsService
  ) {
    this.favoriteMode = this.fb.control('all');

  }

  ngOnInit() {
    this.getUserWords();
    this.favoriteMode.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value: string) => {
      this.restartGame();
      if (value === 'all') {
        this.onClassicMode();
      } else if (value === 'favorites') {
        this.onFavoriteMode();
      }
    });
    this.getTrainWords();
  }
  onStart() {
    this.startAnimation('bounceInDown');
    this.start = true;
    this.getRandomWords(this.wordsFiltredByMode);
  }
  onFavorite() {
    // this.user
  }
  /** Create list of random words from words of user */
  getRandomWords(arrayOfWords: Word[]) {
    this.userRandomWords = this.wordTrainingService.getRandomWords(arrayOfWords);
  }
  nextWord() {
    if (this.wordIndex === this.userRandomWords.length - 1) {
      this.getRandomWords(this.userRandomWords);
      this.wordIndex = 0;
    } else {
      this.wordIndex++;
    }
  }
  prevWord() {
    this.startAnimation('bounceInLeft');

    console.log('works');
    if (this.wordIndex === 0) {
      this.wordIndex = this.userRandomWords.length - 1;
    } else {
      this.wordIndex--;
    }
  }
  getUserWords() {
    // if (localStorage.getItem('userData')) {
    //   // this.userWords = this.getWordFromLocalStorage();
    //   console.log('WORD TRAIN WORDS LOCAL STR', this.userWords);
    //   this.loadingSpinner = false;
    //   this.onClassicMode();
    // } else {
    this.wordTrainingService.getUserWords()
      .pipe(
        // tap(words => words.length === 0 ? this.router.navigate(['vocabulary']) : null),
        takeUntil(this.unsubscribe$))
      .subscribe((words: Word[]) => {
        if (words !== null) {
          this.userWords = words;

          // if (this.userWords.length === 0) {
          //   this.router.navigate(['vocabulary']);
          //   return;
          // }
          this.favoritesWordsQuantity = 0;
          this.userWords.map(word => word.isFavorite === true ? this.favoritesWordsQuantity++ : word);
          console.log('WORD TRAIN WORDS', this.userWords);
          console.log('SUBSCRIBE', this.wordTrainingService.getUserWords());
          if (this.start === false) {
            this.onClassicMode();
          }
        } else {
          console.log('Update data');
        }
        this.loadingSpinner = false;
      });
    // }

  }
  // getWordFromLocalStorage() {
  //   return JSON.parse(localStorage.getItem('userData')).words;
  // }
  onFavoriteMode() {
    this.startAnimation('bounceInDown');
    this.wordsFiltredByMode = this.userWords.filter((word: Word) => word.isFavorite === true);
    this.getRandomWords(this.wordsFiltredByMode);
    this.wordIndex = 0;
    this.unknownMode = false;
  }

  onClassicMode() {
    this.startAnimation('bounceInDown');
    this.wordsFiltredByMode = this.userWords.filter((word: Word) => word);
    this.getRandomWords(this.wordsFiltredByMode);
    this.wordIndex = 0;
    this.unknownMode = false;
  }

  unknownWordMode(words: Word[]) {
    this.start = true;
    this.unknownMode = true;
    this.startAnimation('bounceInDown');
    this.wordsFiltredByMode = words;
    this.getRandomWords(this.wordsFiltredByMode);
    this.wordIndex = 0;
    this.favoriteMode.patchValue('unknown');
  }

  dontKnow(word: Word) {
    this.startAnimation('bounceOutUp');
    // this.startAnimation('bounceInRight');
    const notKnownWord = Object.assign({}, word);
    notKnownWord.knowen = false;
    this.wordTrainingService.addWordToResultWords(this.wordsForResult, notKnownWord);
    setTimeout(() => {
      this.addToFavorites(word);
      this.nextWord();
      this.notknownWords++;
    }, 300);
  }

  onKnow(word: Word) {
    const knownWord = Object.assign({}, word);
    knownWord.knowen = true;
    this.wordTrainingService.addWordToResultWords(this.wordsForResult, knownWord);
    this.startAnimation('bounceInRight');
    console.log('know');
    this.nextWord();
    this.knownWords++;
  }

  restartGame() {
    this.notknownWords = 0;
    this.knownWords = 0;
    this.clearWordsForResult();
  }

  setFavorite(word: Word) {

    this.vocabularyService.editWord(word)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        console.log(res);
      }, err => this.notification.error('', err.error.message))
      ;


  }

  addToFavorites(word: Word) {
    console.log('add to fav');
    if (word.isFavorite === false) {
      word.isFavorite = true;
      this.setFavorite(word);
    }
  }

  removeFromFavorites(word: Word) {
    console.log('remove to fav');
    if (word.isFavorite === true) {
      word.isFavorite = false;
      this.setFavorite(word);

      this.vocabularyService.editWord(word);
    }
  }

  startAnimation(stateAnimate) {
    console.log(stateAnimate);
    if (!this.animationState) {
      this.animationState = stateAnimate;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  goToTrainResult() {
    this.wordTrainingService.setTrainResult(this.wordsForResult);
    this.router.navigate(['train-result']);
  }

  getTrainWords() {
    this.wordTrainingService.getTrainWords$()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Word[]) => {
        if (data.length !== 0) {
          this.unknownWordMode(data);
        }
      });
  }
  clearWordsForResult() {
    this.wordsForResult = [];
  }
  setDefaultMode() {
    this.favoriteMode.patchValue('all');
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    console.log(this.favoriteMode.value);
    this.unknownMode = false;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
