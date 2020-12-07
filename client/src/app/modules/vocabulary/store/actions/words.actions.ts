// import { createAction, props } from '@ngrx/store';
// import { Word } from 'src/app/shared/interfaces';

// export enum WordsActionsType {
//   FetchWords = '[Words] fetch words',
//   FetchWordsSuccess = '[Words] fetch words success',
//   FetchWordsError = '[Words] fetch words error',

//   AddWordToUserWords = '[Words] Add word to user Words',
//   AddWordToUserWordsSuccess = '[Words] Add word to user Words success',
//   AddWordToUserWordsError = '[Words] Add word to user Words error',

//   SaveEditedWord = '[Words] Save edited word',
//   SaveEditedWordSuccess = '[Words] Save edited word success',
//   SaveEditedWordError = '[Words] Save edited word error',

//   DeleteUserWord = '[Words] Delete user word',
//   DeleteUserWordsuccess = '[Words] Delete user word success',
//   DeleteUserWordError = '[Words] Delete user word error',

//   SetWordAsFavorite = '[Words] Set word as favorite'
// }

// export const fetchWordsAction = createAction(WordsActionsType.FetchWords);
// export const fetchWordsSuccessAction = createAction(WordsActionsType.FetchWordsSuccess, props<{ words: Word[] }>());
// export const fetchWordsErrorAction = createAction(WordsActionsType.FetchWordsError, props<{ error: string }>());

// export const addWordToUserWordsAction = createAction(WordsActionsType.AddWordToUserWords, props<{ word: Word }>());
// export const addWordToUserWordsSuccessAction = createAction(WordsActionsType.AddWordToUserWordsSuccess, props<{ words: Word[] }>());
// export const addWordToUserWordsErrorAction = createAction(WordsActionsType.AddWordToUserWordsError, props<{ error: string }>());

// export const saveEditedWordAction = createAction(WordsActionsType.SaveEditedWord, props<{ word: Word }>());
// export const saveEditedWordSuccessAction = createAction(WordsActionsType.SaveEditedWordSuccess, props<{ words: Word[] }>());
// export const saveEditedWordErrorAction = createAction(WordsActionsType.SaveEditedWordError, props<{ error: string }>());

// export const deleteUserWordAction = createAction(WordsActionsType.DeleteUserWord, props<{ word: Word }>());
// export const deleteUserWordSuccessAction = createAction(WordsActionsType.DeleteUserWordsuccess, props<{ words: Word[] }>());
// export const deleteUserWordErrorAction = createAction(WordsActionsType.DeleteUserWordError, props<{ error: string }>());

// export const setWordAsFavoriteAction = createAction(WordsActionsType.SetWordAsFavorite, props<{ word: Word }>());


