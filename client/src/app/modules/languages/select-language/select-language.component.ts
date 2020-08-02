import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Language } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectLanguageComponent {
  selectedLanguage = new FormControl('');
  @Input() set candidateToLearn(candidateId: string) {
    this.selectedLanguage.patchValue(candidateId);
  }
  @Input() allLanguages: Language[];
  @Input() userLanguages: Language[];
  @Input() selectedTab: 0 | 1;

  @Input() set currentlanguageId(currentlanguageId: string) {

    this.selectedLanguage.patchValue(currentlanguageId);


  }

  @Output() addLanguage = new EventEmitter();
  @Output() selectUserLanguageForLearning = new EventEmitter();
  @Output() deleteUserLanguage = new EventEmitter();
  constructor() {
  }


  // onSelectLanguageFromAllLanguages(event: Event, language: Language, ) {
  //   event.preventDefault();
  //   this.selectLanguage.emit(language);
  // }
  addLanguageToUserLanguages(language: Language) {
    this.addLanguage.emit(language);
  }
  // onAddSelectedLanguagesToUserLanguages() {
  //   this.addLanguages.emit(this.allLanguages);
  // }

  onDeleteUserLanguage(languageId: string) {
    this.deleteUserLanguage.emit(languageId);
  }

  onSelectUserLanguageForLearning(languageId: string, userLanguages: Language[]) {
    this.selectUserLanguageForLearning.emit({ languageId, userLanguages });
  }

  // onCloseAllLanguages() {
  //   this.closeAllLanguages.emit();
  // }
}
