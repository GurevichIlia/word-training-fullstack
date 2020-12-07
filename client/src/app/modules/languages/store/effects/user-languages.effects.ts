import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NavigationService } from 'src/app/core';
import { PersistanceService } from 'src/app/shared/services/persistance.service';
import { LanguagesService } from './../../languages.service';
import { LanguageInterface } from './../../types/languages.interfaces';
import { FetchUserLanguagesErrorAction, FetchUserLanguagesSuccessAction, LanguagesActionTypes } from './../actions/languages.actions';

@Injectable()
export class UserLanguagesEffects {

  constructor(
    private actions$: Actions,
    private languagesService: LanguagesService,
    private navigation: NavigationService,
    private persistanceService: PersistanceService
  ) { }


  userLanguages$ = createEffect(() => this.actions$.pipe(
    ofType(LanguagesActionTypes.FetchUserLanguages),
    switchMap(_ => {
      return this.languagesService.getUserLanguages()
        .pipe(
          map((languages: LanguageInterface[]) => {
            return FetchUserLanguagesSuccessAction({ languages })
          }),
          catchError((err: { message: string }) => {
            return of(FetchUserLanguagesErrorAction({ backendErrors: { error: err.message } }))
          })
        )
    }
    ))
  )

  // successAllLanguages$ = createEffect(() => this.actions$.pipe(
  //   ofType(AuthActionsType.LOGIN_SUCCESS),
  //   tap(({ successData }: { successData: AfterLoginDataInterface }) => {
  //     if (successData.currentLanguage) {
  //       // this.generalFacade.setCurrentLanguage(of(resData.currentLanguage));
  //       this.navigation.navigateTo(Routes.Vocabulary)
  //     } else {
  //       this.navigation.navigateTo(Routes.Languages)
  //     }
  //   })
  // ),
  //   { dispatch: false }
  // )
}
