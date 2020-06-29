import { GeneralWord } from './../../../../../src/interfaces';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Word, MenuItem } from 'src/app/shared/interfaces';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordListComponent {
  @Input() words: Word[] | GeneralWord[];
  @Input() filterValue: Observable<string>;
  @Input() trackWords;
  @Input() pageSize: number;
  @Input() selectedGroup: string;
  @Input() isShowDefaultOptions = true;
  @Input() isShowMenu = true;
  @Input() menuItems: MenuItem[];
  @Input() userId: string;




  @Output() action = new EventEmitter();

  onScroll() {
    console.log('qweqwe')
  }
  sendAction({ action, payload }) {
    this.action.emit({ action, payload });
  }
}
