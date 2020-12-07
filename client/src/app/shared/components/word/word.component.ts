import { WordAction } from '../../../core/enums/word.enum';
import {
  ChangeDetectionStrategy, Component,
  EventEmitter, Input, OnInit,
  Output
} from '@angular/core';
import { Action, MenuItem, wordMenuItems } from 'src/app/core';
import {  Word } from 'src/app/shared/interfaces';
import { GeneralWord } from 'src/app/modules/general-words/types/general-words.interfaces';


@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordComponent implements OnInit {
  wordAction = WordAction;
  @Input() word: Word | GeneralWord;
  @Input() isShowMenu = true;
  @Input() isShowDefaultOptions = true;
  @Input() menuItems: MenuItem<WordAction>[] = wordMenuItems;
  @Input() userId: string;
  @Output() action = new EventEmitter<Action>();

  constructor(
  ) { }


  ngOnInit() {
    // this.createEditFormForWord();
  }


  dispatchAction(action: string, payload?: any) {
    this.action.emit({ action, payload });
  }

  isHideDeleteButton() {
    const adminId = '5e2b1984d72eaf2478d678f4';

    if (adminId === this.userId) {
      return false;
    } else if (this.userId === this.word['user']) {
      return false;
    } else {
      return true;
    }

  }
}
