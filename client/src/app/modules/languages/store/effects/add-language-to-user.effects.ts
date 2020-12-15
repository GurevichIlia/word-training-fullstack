import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppStateInterface } from 'src/app/store/reducers';
import { LanguagesService } from './../../languages.service';
import { LanguageInterface } from './../../types/languages.interfaces';
import {
  AddLanguageToUserLanguagesErrorAction,
  AddLanguageToUserLanguagesSuccessAction,
  FetchAllLanguagesAction,
  LanguagesActionTypes
} from './../actions/languages.actions';

@Injectable()
export class AddLanguageToUserEffects {

  constructor(
    private actions$: Actions,
    private languagesService: LanguagesService,

    private store$: Store<AppStateInterface>
  ) { }


  addLangauge$ = createEffect(() => this.actions$.pipe(
    ofType(LanguagesActionTypes.AddLanguageToUserLanguages),
    switchMap(({ languages }: { languages: LanguageInterface[] }) => {
      return this.languagesService.addUserLanguages(languages)
        .pipe(
          map((userLanguages: LanguageInterface[]) => {
            return AddLanguageToUserLanguagesSuccessAction({ userLanguages })
          }),
          catchError((err: { message: string }) => {
            return of(AddLanguageToUserLanguagesErrorAction({ backendErrors: { error: err.message } }))
          })
        )
    }
    ))
  )

  addLanguageSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LanguagesActionTypes.AddLanguageToUserLanguagesSuccess),
    tap(_ => {
      this.store$.dispatch(FetchAllLanguagesAction())
      // this.store$.dispatch(FetchUserLanguagesAction())
    })
  ),
    { dispatch: false }
  )
}
