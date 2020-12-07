import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import {
  NbButtonModule, NbCardModule, NbCheckboxModule,
  NbIconModule, NbListModule, NbSelectModule, NbSpinnerModule
} from '@nebular/theme';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LanguagesComponent } from './languages.component';
import { LanguagesService } from './languages.service';
import { SelectLanguageComponent } from './select-language/select-language.component';
import { AddLanguageToUserEffects } from './store/effects/add-language-to-user.effects';
import { AllLanguagesEffects } from './store/effects/all-languages.effects';
import { CurrentLanguageEffects } from './store/effects/current-language.effects';
import { DeleteUserLanguageEffects } from './store/effects/delete-user-language.effects';
import { UserLanguagesEffects } from './store/effects/user-languages.effects';
import { languagesReducer, LANGUAGES_REDUCER_NODE } from './store/reducers/languages.reducers';

const languageRoutes: Routes = [
  { path: '', component: LanguagesComponent }
];


@NgModule({
  declarations: [
    LanguagesComponent,
    SelectLanguageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbSelectModule,
    NbSpinnerModule,
    NbListModule,
    NbIconModule,
    NbCheckboxModule,
    MatBadgeModule,
    MatTabsModule,
    NbButtonModule,

    RouterModule.forChild(languageRoutes),
    StoreModule.forFeature(LANGUAGES_REDUCER_NODE, languagesReducer),
    EffectsModule.forFeature([
      AddLanguageToUserEffects,
      AllLanguagesEffects,
      UserLanguagesEffects,
      DeleteUserLanguageEffects,
      ])
  ],
  providers: [LanguagesService]
})
export class LanguagesModule { }
