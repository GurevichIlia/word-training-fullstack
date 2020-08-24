import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuItem, Word, GeneralWord } from 'src/app/shared/interfaces';


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
  @Input() showenItems = 15;
  isShowGoToTopButton$: Observable<boolean> = fromEvent(window, 'scroll').pipe(map(event => window.scrollY >= 1400));

  @Output() action = new EventEmitter();

  onScroll() {
    this.showMoreWords();
    
  }
  
  sendAction({ action, payload }) {
    this.action.emit({ action, payload });
  }

  showMoreWords() {
    this.showenItems += 15;
  }

  goToTop() {
    window.scrollTo({ top: 50 });
  }


}
