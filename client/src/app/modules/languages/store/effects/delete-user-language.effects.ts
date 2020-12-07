import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { NavigationService } from 'src/app/core';
import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';
import { PersistanceService } from 'src/app/shared/services/persistance.service';
import { getLearningLanguageAction } from 'src/app/store/actions/language.actions';
import { AppStateInterface } from 'src/app/store/reducers';
import { LanguagesService } from './../../languages.service';
import {
  DeleteUserLanguageErrorAction,
  DeleteUserLanguageSuccessAction,
  FetchAllLanguagesAction,
  LanguagesActionTypes
} from './../actions/languages.actions';

@Injectable()
export class DeleteUserLanguageEffects {

  constructor(
    private actions$: Actions,
    private languagesService: LanguagesService,
    private navigation: NavigationService,
    private persistanceService: PersistanceService,
    private store$: Store<AppStateInterface>

  ) { }


  deleteUserLanguage$ = createEffect(() => this.actions$.pipe(
    ofType(LanguagesActionTypes.DeleteUserLanguage),
    switchMap(({ languageId }: { languageId: string }) => {

      return this.languagesService.deleteUserLanguage(languageId)
        .pipe(
          map((userLanguages: LanguageInterface[]) => {
            return DeleteUserLanguageSuccessAction({ userLanguages })
          }),
          catchError((err: { message: string }) => {
            return of(DeleteUserLanguageErrorAction({ backendErrors: { error: err.message } }))
          })
        )
    }
    ))
  )

  deleteUserLanguageSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LanguagesActionTypes.DeleteUserLanguageSuccess),
    tap(_ => {
      this.store$.dispatch(FetchAllLanguagesAction())
      this.store$.dispatch(getLearningLanguageAction())

      // this.store$.dispatch(FetchUserLanguagesAction())
    })
  ),
    { dispatch: false }
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
