import { WordTrainingFacade } from './../word-training.facade';
import { animate, keyframes, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Word } from 'src/app/shared/interfaces';
import * as kf from '../../../shared/keyframes';
import { WordTrainingService } from '../word-training.service';
import { NotificationsService } from './../../../shared/services/notifications.service';
import { AppRoutes } from 'src/app/core/routes/routes';
import { NavigationService } from 'src/app/core';

export interface CounterState {
  totalLearnedCards: number,
  uniqueWordsLearned: number,
  wordsInGroup: Word[],
}

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
  animations: [
    trigger('wordCardAnimator', [
      transition('* => bounceInRight', animate(500, keyframes(kf.bounceInRight))),
      transition('* => bounceOutUp', animate(500, keyframes(kf.bounceOutUp))),
      transition('* => bounceInDown', animate(500, keyframes(kf.bounceInDown))),
      transition('* => bounceInLeft', animate(500, keyframes(kf.bounceInLeft)))

    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  currentWord$: Observable<Word>
  animationState$: Observable<string>
  // totalLearnedCards$: Observable<number>
  // uniqueWordsLearned$: Observable<number>
  // wordsInGroup$: Observable<Word[]>
  counterState$: Observable<CounterState>
  constructor(
    // private changeDetector: ChangeDetectorRef,
    // private notification: NotificationsService
    private wordTrainingFacade: WordTrainingFacade
  ) { }

  ngOnInit() {
    this.initializeValues();
  }

  initializeValues() {
    this.currentWord$ = this.wordTrainingFacade.wordForLearning$
    this.animationState$ = this.wordTrainingFacade.animationState$;
    // this.totalLearnedCards$ = this.wordTrainingFacade.totalLearnedCards$
    // this.uniqueWordsLearned$ = this.wordTrainingFacade.uniqueWordsLearned$
    // this.wordsInGroup$ = this.wordTrainingFacade.wordsInGroup$

    this.counterState$ = this.wordTrainingFacade.counterState$
  }

  stopTraining() {
    this.wordTrainingFacade.stopTrain();

  }

  // showResult() {
  //   this.router.navigate(['word-training/train-result']);
  // }

  onResetAnimationState() {
    // this.resetAnimationState.emit();
    this.wordTrainingFacade.resetAnimationState();

  }

  nextWord(word: Word, knowledgeLevel: number) {
    // this.wordTrainingService.nextWord(word, knowledgeLevel);
    // this.getCurrentTrainingWord();
    this.wordTrainingFacade.nextWord(word, knowledgeLevel)
    // this.animationState = this.wordTrainingService.getAnimationState();
  }

  // getCurrentTrainingWord(updatedWord?: Word) {

  //   if (updatedWord) {
  //     return this.currentWord$ = this.wordTrainingService.getCurrentTrainingWord$()
  //       .pipe(map(word => ({ ...word, ...updatedWord })));

  //   }

  //   this.currentWord$ = this.wordTrainingService.getCurrentTrainingWord$();
  // }

  previousWord() {

  }

  saveWordsTrainingProgress() {
    // this.wordTrainingService.updateWords()
    //   .pipe(
    //     takeUntil(this.unsubscribe$)
    //   )
    //   .subscribe(res => console.log('WORDS AFTER UPDATE', res));
  }

  favoriteToggle(word: Word) {
    //   const updatedWord = { ...word, isFavorite: !word.isFavorite };
    //   this.currentWord$ = this.getCurrentTrainingWord(updatedWord);
    //   this.changeDetector.markForCheck();
    //   this.wordTrainingService.favoriteToggle(word)
    //     .pipe(
    //       takeUntil(this.unsubscribe$)
    //     ).subscribe(res => {

    //     }, err => {
    //       this.currentWord$ = of(word);
    //       this.changeDetector.markForCheck();
    //       this.notification.error('Could not add to favorite, something went wrong');
    //     });

  }

  ngOnDestroy() {
    // this.saveWordsTrainingProgress();
    // this.wordTrainingService.onFinishTraining();
    this.stopTraining()
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
