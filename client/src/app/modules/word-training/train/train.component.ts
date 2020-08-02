import { NotificationsService } from './../../../shared/services/notifications.service';
import { Component, ChangeDetectionStrategy, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { trigger, transition, animate, keyframes } from '@angular/animations';
import { NbCardBackComponent } from '@nebular/theme';
import { Subject, of } from 'rxjs';
import { WordTrainingService } from '../word-training.service';
import { Router } from '@angular/router';
import { Word } from 'src/app/shared/interfaces';
import { takeUntil, map } from 'rxjs/operators';
import * as kf from '../../../shared/keyframes';

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
  currentWord$ = this.wordTrainingService.getCurrentTrainingWord$();
  animationState$ = this.wordTrainingService.getAnimationState();
  constructor(
    private wordTrainingService: WordTrainingService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private notification: NotificationsService
  ) { }

  ngOnInit() {
    this.getCurrentTrainingWord();
  }

  stopTraining() {
    this.wordTrainingService.onFinishTraining();
    this.showResult();
  }

  showResult() {
    this.router.navigate(['word-training/train-result']);
  }

  onResetAnimationState() {
    // this.resetAnimationState.emit();
    this.wordTrainingService.resetAnimationState();
  }

  nextWord(word: Word, knowledgeLevel: number) {
    this.wordTrainingService.nextWord(word, knowledgeLevel);
    this.getCurrentTrainingWord();

    // this.animationState = this.wordTrainingService.getAnimationState();
  }

  getCurrentTrainingWord(updatedWord?: Word) {

    if (updatedWord) {
      return this.currentWord$ = this.wordTrainingService.getCurrentTrainingWord$()
        .pipe(map(word => ({ ...word, ...updatedWord })));

    }

    this.currentWord$ = this.wordTrainingService.getCurrentTrainingWord$();
  }

  previousWord() {

  }

  saveWordsTrainingProgress() {
    this.wordTrainingService.updateWords()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(res => console.log('WORDS AFTER UPDATE', res));
  }

  favoriteToggle(word: Word) {
    const updatedWord = { ...word, isFavorite: !word.isFavorite };
    this.currentWord$ = this.getCurrentTrainingWord(updatedWord);
    this.changeDetector.markForCheck();
    this.wordTrainingService.favoriteToggle(word)
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(res => {

      }, err => {
        this.currentWord$ = of(word);
        this.changeDetector.markForCheck();
        this.notification.error('Could not add to favorite, something went wrong');
      });

  }

  ngOnDestroy() {
    this.saveWordsTrainingProgress();
    this.wordTrainingService.onFinishTraining();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
