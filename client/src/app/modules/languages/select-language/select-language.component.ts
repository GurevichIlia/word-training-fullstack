import { AppStateInterface } from 'src/app/store/reducers';
import { ActiveLanguagesTab } from './../types/languages.enums';
import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AddLanguageToUserLanguagesAction, DeleteUserLanguageAction } from '../store/actions/languages.actions';

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

  @Input() allLanguages: LanguageInterface[];
  @Input() userLanguages: LanguageInterface[];
  @Input() activeLanguagesTab: ActiveLanguagesTab;

  @Input() set currentlanguageId(currentlanguageId: string) {
    this.selectedLanguage.patchValue(currentlanguageId);
  }

  // @Output() addLanguage = new EventEmitter();
  @Output() selectUserLanguageForLearning = new EventEmitter();
  // @Output() deleteUserLanguage = new EventEmitter();
  constructor(
    private store$: Store<AppStateInterface>
  ) {
  }

  // onSelectLanguageFromAllLanguages(event: Event, language: Language, ) {
  //   event.preventDefault();
  //   this.selectLanguage.emit(language);
  // }
  addLanguageToUserLanguages(language: LanguageInterface) {
    this.store$.dispatch(AddLanguageToUserLanguagesAction({ languages: [language] }))

  }
  // onAddSelectedLanguagesToUserLanguages() {
  //   this.addLanguages.emit(this.allLanguages);
  // }

  onDeleteUserLanguage(languageId: string) {
    this.store$.dispatch(DeleteUserLanguageAction({ languageId }))
    // this.deleteUserLanguage.emit(languageId);
  }

  onSelectUserLanguageForLearning(languageId: string, userLanguages: LanguageInterface[]) {
    // this.store$.dispatch(setCurrentLearningLanguageAction({ languageId }))

    this.selectUserLanguageForLearning.emit({ languageId, userLanguages });
  }

  // onCloseAllLanguages() {
  //   this.closeAllLanguages.emit();
  // }
}
