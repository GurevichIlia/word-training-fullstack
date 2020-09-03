import {
  ChangeDetectionStrategy, Component,






  EventEmitter, Input, OnInit,




  Output
} from '@angular/core';
import { GeneralWord, MenuItem, Word } from 'src/app/shared/interfaces';


@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordComponent implements OnInit {
  @Input() word: Word | GeneralWord;
  @Input() isShowMenu = true;
  @Input() isShowDefaultOptions = true;
  @Input() menuItems: MenuItem[];
  @Input() userId: string;
  @Output() action = new EventEmitter();

  constructor(
  ) { }


  ngOnInit() {
    // this.createEditFormForWord();
  }


  dispatchAction(action: string, payload: any, index?: number) {
    this.action.emit({ action, payload, index });
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
