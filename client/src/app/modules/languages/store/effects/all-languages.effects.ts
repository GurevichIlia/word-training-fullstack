import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { AppStateInterface } from 'src/app/store/reducers';
import { userlanguagesSelector } from '../selectors/languages.selectors';
import { LanguagesService } from './../../languages.service';
import { LanguageInterface } from './../../types/languages.interfaces';
import { FetchAllLanguagesErrorAction, FetchAllLanguagesSuccessAction, LanguagesActionTypes } from './../actions/languages.actions';


@Injectable()
export class AllLanguagesEffects {

  constructor(
    private actions$: Actions,
    private languagesService: LanguagesService,
    private store$: Store<AppStateInterface>,

  ) { }


  allLanguages$ = createEffect(() => this.actions$.pipe(
    ofType(LanguagesActionTypes.FetchAllLanguages),
    switchMap(_ => {
      return this.languagesService.getAllLanguages()
        .pipe(
          map((allLanguages: LanguageInterface[]) => this.languagesService.addCountryFlagToLanguage(allLanguages)),
          switchMap((languages: LanguageInterface[]) => {
            const userLanguages$ = this.store$.pipe(
              select(userlanguagesSelector),
              filter(userLanguages => userLanguages !== null)
            )
            return this.languagesService.markLanguageAsAddedToUserLanguages(languages, userLanguages$)
          }),
          map((languages: LanguageInterface[]) => {
            return FetchAllLanguagesSuccessAction({ languages })
          }),
          catchError((err: { message: string }) => {
            return of(FetchAllLanguagesErrorAction({ backendErrors:  { error: err.message }}))
          })
        )
    }
    ))
  )


}
