import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Word } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss']
})
export class WordCardComponent {
  @Input() word: Word;
  @Output() favoriteToggle = new EventEmitter<Word>();


  favorite(word: Word) {
    this.favoriteToggle.emit(word);
  }
}
