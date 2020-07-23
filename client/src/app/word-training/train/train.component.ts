import { animate, keyframes, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as kf from '../../shared/keyframes';
import { WordTrainingService } from './../word-training.service';
import { Word } from 'src/app/shared/interfaces';
import { NbCardBackComponent } from '@nebular/theme';

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
export class TrainComponent implements OnDestroy, AfterViewInit {
  @ViewChild('wordCard') wordCard: ElementRef;
  @ViewChild('translationCard') translationCard: NbCardBackComponent ;

  // @Input() start: boolean;
  // @Input() animationState: string;
  // @Input() word: Word;


  // @Output() toTrainResult = new EventEmitter();
  // @Output() resetAnimationState = new EventEmitter()
  // @Output() setKnowledgeLevel = new EventEmitter();

  unsubscribe$ = new Subject();
  currentWord$ = this.wordTrainingService.getCurrentTrainingWord$();
  animationState$ = this.wordTrainingService.getAnimationState();
  constructor(
    private wordTrainingService: WordTrainingService,
    private router: Router
  ) { }

  ngAfterViewInit() {
    console.log(this.wordCard);
    console.log(this.translationCard);

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
    console.log(this.wordCard);
    console.log(this.translationCard);
    // this.animationState = this.wordTrainingService.getAnimationState();
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

  ngOnDestroy() {
    this.saveWordsTrainingProgress();
    this.wordTrainingService.onFinishTraining();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
