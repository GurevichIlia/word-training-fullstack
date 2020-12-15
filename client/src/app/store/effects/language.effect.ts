import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { NavigationService } from 'src/app/core';
import { AppRoutes } from 'src/app/core/routes/routes';
import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';
import { ApiLanguagesService } from 'src/app/shared/services/api/api-languages.service';
import {
  getCurrentLearningLanguageErrorAction,
  getCurrentLearningLanguageSuccessAction,
  LanguageActionTypes
} from '../actions/language.actions';



@Injectable()
export class LanguageEffects {

  constructor(
    private actions$: Actions,
    private languagesApi: ApiLanguagesService,
    private navigation: NavigationService,
  ) { }

  currentLanguage$ = createEffect(() => this.actions$.pipe(
    ofType(LanguageActionTypes.GET_CURRENT_LEARNING_LANGUAGE),
    switchMap(_ => {
      return this.languagesApi.getCurrentLanguage$()
        .pipe(
          map(language => getCurrentLearningLanguageSuccessAction({ currentLanguage: language })),
          catchError(err => of(getCurrentLearningLanguageErrorAction({ error: err })))
        )
    })
  ))


  getCurrentLanguageSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LanguageActionTypes.GET_CURRENT_LEARNING_LANGUAGE_SUCCESS),
    tap(({ currentLanguage }: { currentLanguage: LanguageInterface }) => {

      if (currentLanguage) {
        // this.generalFacade.setCurrentLanguage(of(resData.currentLanguage));
        this.navigation.navigateTo(AppRoutes.Vocabulary)
      } else {
        this.navigation.navigateTo(AppRoutes.Languages)
      }
    })
  ),
    { dispatch: false }
  )
}
