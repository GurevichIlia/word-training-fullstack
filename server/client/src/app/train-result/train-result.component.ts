import { WordTrainingService } from './../word-training/word-training.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Word } from '../shared/interfaces';

@Component({
  selector: 'app-train-result',
  templateUrl: './train-result.component.html',
  styleUrls: ['./train-result.component.scss']
})
export class TrainResultComponent implements OnInit {
  dontKnowWordsList: Word[];
  wordsForResult$: Observable<Word[]>;
  knownWordsQuantity = 0;
  unknownWordsQuantity = 0;
  trainedWords: Word[];
  unknownWords: Word[];
  constructor(
    private trainingService: WordTrainingService ,
    private router: Router
  ) { }

  ngOnInit() {
    this.getWordsForResult();
    this.setTrainedWords([...this.trainingService.getTrainResult()]);
  }
  getWordsForResult() {

    this.wordsForResult$ = this.trainingService.getTrainResult$().pipe(map(words => {
      this.knownWordsQuantity = 0;
      this.unknownWordsQuantity = 0;
      words.map(word => {
        word.knowen === true ? this.knownWordsQuantity++ : '',
          word.knowen === false ? this.unknownWordsQuantity++ : '';
      });
      console.log('Trained Owrds', this.trainedWords);
      return words;
    }));
  }
  setTrainedWords(words: Word[]) {
    this.trainedWords = words;
    this.setUnknownWords(words);
  }
  setUnknownWords(words: Word[]) {
    this.unknownWords = words.filter(data => data.knowen === false);
    console.log(this.unknownWords);
    console.log(this.trainedWords);
    console.log('IMUT WORDS', this.trainingService.getTrainResult());
  }
  getUnknownWords() {
    return this.unknownWords;
  }
  trainUnknownWords() {
    this.trainingService.setTrainWords(this.getUnknownWords());
    this.router.navigate(['word-training']);
  }
  trainAgain() { 
    this.router.navigate(['word-training']);
  }
  goToVocabulary() {
    this.router.navigate(['vocabulary']);
  }
}
