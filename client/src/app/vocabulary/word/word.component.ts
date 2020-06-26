import { AssignWordsService } from './../assign-words.service';

import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Word } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordComponent implements OnInit {
  @Input() word: Word;
  @Input() isShowDefaultOptions = true;
  @Output() action = new EventEmitter();
  items = [{ title: 'Edit' }, { title: 'Delete' }];

  constructor(
   ) { }


  ngOnInit() {
    // this.createEditFormForWord();
  }


  dispatchAction(action: string, payload: any) {
    this.action.emit({ action, payload });
  }

}
