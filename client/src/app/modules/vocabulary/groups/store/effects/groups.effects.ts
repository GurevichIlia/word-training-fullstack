// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { select, Store } from '@ngrx/store';
// import { of } from 'rxjs';
// import { catchError, map, switchMap, tap } from 'rxjs/operators';
// import { LanguageInterface } from 'src/app/modules/languages/types/languages.interfaces';
// import { WordGroup } from 'src/app/shared/interfaces';
// import { AppStateInterface } from 'src/app/store/reducers';
// import { GroupsService } from '../../services/groups.service';
// import { fetchGroupsErrorAction, fetchGroupsSuccessAction, GroupsActionsType } from './../actions/groups.actions';
// import { currentLanguageSelector } from './../../../../../store/selectors/language.selector'

// @Injectable()
// export class GroupsEffects {

//   // loadWords$ = createEffect(() => this.actions$.pipe(
//   //   ofType(WordsActionsType.LoadWords),
//   //   mergeMap(() => this.wordsService.getAllUserWords$()
//   //     .pipe(
//   //       map(words => new WordsLoadedSuccessAction(words)),
//   //       catchError(() => EMPTY)
//   //     ))
//   constructor(
//     private actions$: Actions,
//     private groupsService: GroupsService,
//     private store$: Store<AppStateInterface>
//   ) { }

//   loadGroups$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(GroupsActionsType.FetchGroups),
//       switchMap(_ => {
//         return this.store$.pipe(
//           select(currentLanguageSelector),
//           tap(lang => console.log('LANG EFFECT', lang)),
//           switchMap((language: LanguageInterface) =>
//             this.groupsService.getWordsGroups$(language)
//               .pipe(
//                 map((groups: WordGroup[]) => {
//                   console.log('Groups', groups)
//                   return fetchGroupsSuccessAction({ groups });
//                 }),
//                 catchError((err: any) => of(fetchGroupsErrorAction({ error: err })))
//               ))
//         )
//       })
//     ));

// }
