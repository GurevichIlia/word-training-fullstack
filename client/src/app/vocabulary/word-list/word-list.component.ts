import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Word } from 'src/app/shared/interfaces';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordListComponent {
  @Input() words: Word[];
  @Input() filterValue: FormControl;
  @Input() trackWords;
  @Input() pageSize: number;
  @Input() selectedGroup: string;


  @Output() action = new EventEmitter();


  sendAction({ action, payload }) {
    this.action.emit({ action, payload });
  }
}
