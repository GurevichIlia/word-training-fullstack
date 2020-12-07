// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { Store } from '@ngrx/store';
// import { of } from 'rxjs';
// import { catchError, map, switchMap, tap } from 'rxjs/operators';
// import { NavigationService } from 'src/app/core';
// import { Routes } from 'src/app/core/routes/routes.ts';
// import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';
// import { PersistanceService } from 'src/app/shared/services/persistance.service';
// import { AppStateInterface } from 'src/app/store/reducers';
// import { HomeActionsType, setCurrentLearningLanguageErrorAction } from '../actions/home.actions';
// import { ApiLanguagesService } from './../../../../shared/services/api/api-languages.service';
// import {
//   getCurrentLearningLanguageErrorAction,
//   getCurrentLearningLanguageSuccessAction, setCurrentLearningLanguageSuccessAction
// } from './../actions/home.actions';

// @Injectable()
// export class CurrentLanguageEffects {

//   constructor(
//     private actions$: Actions,
//     private languagesApi: ApiLanguagesService,
//     private navigation: NavigationService,
//     private store$: Store<AppStateInterface>,
//     private persistanceService: PersistanceService
//   ) { }

//   getCurrentLanguage$ = createEffect(() => this.actions$.pipe(
//     ofType(HomeActionsType.GET_CURRENT_LEARNING_LANGUAGE),
//     switchMap(_ => {
//       return this.languagesApi.getCurrentLanguage$()
//         .pipe(
//           map((currentLanguage: LanguageInterface) => {
//             return getCurrentLearningLanguageSuccessAction({ currentLanguage })
//           }),
//           catchError((error) => {
//             return of(getCurrentLearningLanguageErrorAction({ error }))
//           })
//         )
//     }
//     ))
//   )
//   getCurrentLanguageSuccess$ = createEffect(() => this.actions$.pipe(
//     ofType(HomeActionsType.GET_CURRENT_LEARNING_LANGUAGE_SUCCESS),
//     tap(({ currentLanguage }: { currentLanguage: LanguageInterface }) => {

//       if (currentLanguage) {
//         // this.generalFacade.setCurrentLanguage(of(resData.currentLanguage));
//         this.navigation.navigateTo(Routes.Vocabulary)
//       } else {
//         this.navigation.navigateTo(Routes.Languages)
//       }
//     })
//   ),
//     { dispatch: false }
//   )

//   setCurrentLanguage$ = createEffect(() => this.actions$.pipe(
//     ofType(HomeActionsType.SET_CURRENT_LEARNING_LANGUAGE),
//     switchMap(({ languageId }: { languageId: string }) => {
//       return this.languagesApi.setCurrentLanguageOnServer(languageId)
//         .pipe(
//           map((currentLanguage: LanguageInterface) => setCurrentLearningLanguageSuccessAction({ currentLanguage })),
//           catchError((error) => {
//             return of(setCurrentLearningLanguageErrorAction({ error }))
//           })
//         )
//     }
//     ))
//   )
//   setCurrentLanguageSuccess$ = createEffect(() => this.actions$.pipe(
//     ofType(HomeActionsType.SET_CURRENT_LEARNING_LANGUAGE_SUCCESS),
//     tap(({ currentLanguage }: { currentLanguage: LanguageInterface }) => {
//       debugger
//       // if (currentLanguage) {
//       //   // this.generalFacade.setCurrentLanguage(of(resData.currentLanguage));
//       //   this.navigation.navigateTo(Routes.Vocabulary)
//       // } else {
//       //   this.navigation.navigateTo(Routes.Languages)
//       // }
//     })
//   ),
//     { dispatch: false }
//   )

// }
