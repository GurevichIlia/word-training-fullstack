import { WordAction } from './../../../core/enums/word';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action, MenuItem } from 'src/app/core';
import { Word, GeneralWord } from 'src/app/shared/interfaces';


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
  @Input() menuItems: MenuItem<WordAction>[];
  @Input() userId: string;
  @Input() showenItems = 15;
  isShowGoToTopButton$: Observable<boolean> = fromEvent(window, 'scroll').pipe(map(event => window.scrollY >= 1400));

  @Output() action = new EventEmitter();

  onScroll() {
    this.showMoreWords();

  }

  sendAction(event: Action) {

    this.action.emit(event);
  }

  showMoreWords() {
    this.showenItems += 15;
  }

  goToTop() {
    window.scrollTo({ top: 50 });
  }


}
