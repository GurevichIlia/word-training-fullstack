import { setCurrentLanguage } from './../../../../store/actions/general.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, createAction } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { NavigationService } from 'src/app/core';
import { AppRoutes } from 'src/app/core/routes/routes';
import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';
import { ApiLanguagesService } from 'src/app/shared/services/api/api-languages.service';
import { PersistanceService } from 'src/app/shared/services/persistance.service';
import { AppStateInterface } from 'src/app/store/reducers';
import {
  LanguagesActionTypes, setCurrentLearningLanguageErrorAction, setCurrentLearningLanguageSuccessAction
} from './../actions/languages.actions';
import { setCurrentLanguageAction } from 'src/app/store/actions/language.actions';


@Injectable()
export class CurrentLanguageEffects {

  constructor(
    private actions$: Actions,
    private languagesApi: ApiLanguagesService,
    private navigation: NavigationService,
    private store$: Store<AppStateInterface>,
    private persistanceService: PersistanceService
  ) { }

  // currentLanguage$ = createEffect(() => this.actions$.pipe(
  //   tap(a => console.log('ACTION', a)),
  //   ofType(LanguagesActionTypes.GET_CURRENT_LEARNING_LANGUAGE),
  //   switchMap(_ => {
  //     return this.languagesApi.getCurrentLanguage$()
  //       .pipe(
  //         map(language => getCurrentLearningLanguageSuccessAction({ currentLanguage: language })),
  //         catchError(err => of(getCurrentLearningLanguageErrorAction({ error: err })))
  //       )
  //   })
  // ))


  // getCurrentLanguageSuccess$ = createEffect(() => this.actions$.pipe(
  //   ofType(LanguagesActionTypes.GET_CURRENT_LEARNING_LANGUAGE_SUCCESS),
  //   tap(({ currentLanguage }: { currentLanguage: LanguageInterface }) => {

  //     if (currentLanguage) {
  //       // this.generalFacade.setCurrentLanguage(of(resData.currentLanguage));
  //       this.navigation.navigateTo(Routes.Vocabulary)
  //     } else {
  //       this.navigation.navigateTo(Routes.Languages)
  //     }
  //   })
  // ),
  //   { dispatch: false }
  // )

  setCurrentLanguage$ = createEffect(() => this.actions$.pipe(
    ofType(LanguagesActionTypes.SET_CURRENT_LEARNING_LANGUAGE),
    switchMap(({ languageId }: { languageId: string }) => {
      return this.languagesApi.setCurrentLanguageOnServer(languageId)
        .pipe(
          map((currentLanguage: LanguageInterface) => setCurrentLearningLanguageSuccessAction({ currentLanguage })),
          catchError((error) => {
            return of(setCurrentLearningLanguageErrorAction({ error }))
          })
        )
    }
    ))
  )

  setCurrentLanguageSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LanguagesActionTypes.SET_CURRENT_LEARNING_LANGUAGE_SUCCESS),
    tap(({ currentLanguage }: { currentLanguage: LanguageInterface }) => {

      if (currentLanguage) {
        this.store$.dispatch(setCurrentLanguageAction({ language: currentLanguage }))
        this.navigation.navigateTo(AppRoutes.Vocabulary)
      }
    })
  ),
    { dispatch: false }
  )

}
