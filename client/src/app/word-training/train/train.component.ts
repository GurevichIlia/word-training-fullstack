import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { trigger, transition, animate, keyframes } from '@angular/animations';
import * as kf from '../../shared/keyframes';

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
export class TrainComponent {
  @Input() start: boolean;
  @Input() animationState: string;
  @Input() word: Word;


  @Output() toTrainResult = new EventEmitter();
  @Output() resetAnimationState = new EventEmitter()
  @Output() setKnowledgeLevel = new EventEmitter();




  goToTrainResult() {
    this.toTrainResult.emit();
  }

  onResetAnimationState() {
    this.resetAnimationState.emit();
  }

  onSetKnowledgeLevel(wordId: string, level: number) {
    this.setKnowledgeLevel.emit({ wordId, level });
  }
}
