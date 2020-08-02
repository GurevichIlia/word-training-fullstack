import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-language',
  templateUrl: './new-language.component.html',
  styleUrls: ['./new-language.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class NewLanguageComponent implements OnInit {
  language = '';
  @Output() addLanguage = new EventEmitter();
  @Output() changeMode = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }


  saveLanguage() {
    this.addLanguage.emit(this.language);
  }

  onCancel() {
    this.changeMode.emit();
  }
}
