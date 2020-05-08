import { FormControl } from '@angular/forms';
import { Language } from './../../shared/interfaces';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { NbSelectComponent } from '@nebular/theme';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectLanguageComponent implements OnChanges {
  @Input() allLanguages: Language[];
  @Input() userLanguages: Language[];

  @Input() currentlanguageId: string;
  @Output() action = new EventEmitter();
  @Output() addLanguages = new EventEmitter();
  @Output() selectLanguage = new EventEmitter();
  constructor() { }

  ngOnChanges() {
  }

  dispatchAction(action: string, payload?: any) {
    // const payload = this.languages.find(lang => lang._id === id);
    this.action.emit({ action, payload });
    console.log({ action, payload });
  }

  onSelectLanguage(language: Language) {
    this.selectLanguage.emit(language)
  }

  onAddLanguages() {
    this.addLanguages.emit();
  }
}
