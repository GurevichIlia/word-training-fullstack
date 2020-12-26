import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Word } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss']
})
export class WordCardComponent {
  isFlipped = false
  @ViewChild('frontCard') frontCard
  @Input() word: Word;
  @Output() favoriteToggle = new EventEmitter<Word>();

  favorite(word: Word) {
    this.favoriteToggle.emit(word);
  }

  flipToggle() {
    this.isFlipped = !this.isFlipped
  }
}
