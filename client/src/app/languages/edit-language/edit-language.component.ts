import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Language } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-edit-language',
  templateUrl: './edit-language.component.html',
  styleUrls: ['./edit-language.component.scss']
})
export class EditLanguageComponent implements OnInit {
  @Input() language: Language;
  @Output() editLanguage = new EventEmitter();
  @Output() changeMode = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }


  onEdit() {
    this.editLanguage.emit(this.language);
  }

  onCancel() {
    this.changeMode.emit();
  }
}
