import { takeUntil } from 'rxjs/operators';
import { TrainResultService } from './train-result.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Word } from '../../shared/interfaces';

@Component({
  selector: 'app-train-result',
  templateUrl: './train-result.component.html',
  styleUrls: ['./train-result.component.scss']
})
export class TrainResultComponent implements OnInit, OnDestroy {
  userWordsFilteredByTrainingGroup$: Observable<Word[]> = this.trainResultService.getFiltredWordsByGroup();
  subscription$ = new Subject();
  // dontKnowWordsList: Word[];
  // wordsForResult$: Observable<Word[]>;
  // knownWordsQuantity = 0;
  // unknownWordsQuantity = 0;
  // trainedWords: Word[];
  // unknownWords: Word[];
  trainedGroup$ = this.trainResultService.getTrainedGroup();
  constructor(
    private trainResultService: TrainResultService,
    private router: Router
  ) { }

  ngOnInit() {
    this.saveWordsTrainingProgress();
    // this.getWordsForResult();
    // this.setTrainedWords([...this.trainingService.getTrainResult()]);
  }
  // getWordsForResult() {

  //   this.wordsForResult$ = this.trainingService.getTrainResult$().pipe(map(words => {
  //     this.knownWordsQuantity = 0;
  //     this.unknownWordsQuantity = 0;
  //     words.map(word => {
  //       word.knowen === true ? this.knownWordsQuantity++ : '',
  //         word.knowen === false ? this.unknownWordsQuantity++ : '';
  //     });
  //     console.log('Trained Owrds', this.trainedWords);
  //     return words;
  //   }));
  // }
  // setTrainedWords(words: Word[]) {
  //   this.trainedWords = words;
  //   this.setUnknownWords(words);
  // }
  // setUnknownWords(words: Word[]) {
  //   this.unknownWords = words.filter(data => data.knowen === false);
  //   console.log(this.unknownWords);
  //   console.log(this.trainedWords);
  //   console.log('IMUT WORDS', this.trainingService.getTrainResult());
  // }
  // getUnknownWords() {
  //   return this.unknownWords;
  // }
  changeGroup() {
    // this.trainingService.setTrainWords(this.getUnknownWords());
    this.router.navigate(['word-training']);
  }

  trainAgain() {
    this.router.navigate(['word-training']);
  }

  goToVocabulary() {

    this.trainResultService.setDefaultValueForSelectedGroupForTraining();
    this.router.navigate(['vocabulary']);
  }

  saveWordsTrainingProgress() {
    this.trainResultService.updateWords()
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe(res => console.log('WORDS AFTER UPDATE', res));
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
