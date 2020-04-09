import { FormControl } from '@angular/forms';
import { Language } from './../../shared/interfaces';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectLanguageComponent implements OnChanges {
  @Input() compareFunction: () => void;
  @Input() languages: Language[];
  @Input() currentlanguageId: string;
  @Output() action = new EventEmitter();
  constructor() { }

  ngOnChanges() {
  }

  dispatchAction(action: string, payload: any) {
    // const payload = this.languages.find(lang => lang._id === id);
    this.action.emit({ action, payload });
    console.log({ action, payload });
  }
}
