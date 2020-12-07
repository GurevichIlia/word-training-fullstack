import { Action, createReducer } from '@ngrx/store';
import { ReducerNode } from './../../../../core/enums/store.enum';
import { VocabularyStateInterface } from './../../types/vocabulary-state.interface';

export const VOCABULARY_REDUCER_NODE: ReducerNode = ReducerNode.VOCABULARY

const initialState: VocabularyStateInterface = {
  isCloseWordModal: false,
  vocabularyLoader: false

}

const reducers = createReducer(
  initialState,
  // on(
  //   fetchWordsAction,
  //   (state): VocabularyStateInterface => ({
  //     ...state,
  //     vocabularyLoader: true
  //   })
  // ),
  // on(
  //   fetchWordsSuccessAction,
  //   (state, action): VocabularyStateInterface => ({
  //     ...state,
  //     vocabularyLoader: false,
  //     words: action.words
  //   })
  // ),
  // on(
  //   fetchWordsErrorAction,
  //   (state, action): VocabularyStateInterface => ({
  //     ...state,
  //     vocabularyLoader: false,
  //     error: action.error
  //   })
  // ),
  // on(
  //   addWordToUserWordsAction,
  //   (state): VocabularyStateInterface => ({
  //     ...state,
  //     isCloseWordModal: false,
  //     isLoading: true,
  //     error: null
  //   })
  // ),
  // on(
  //   addWordToUserWordsSuccessAction,
  //   (state, action): VocabularyStateInterface => ({
  //     ...state,
  //     isLoading: false,
  //     words: action.words,
  //     isCloseWordModal: true
  //   })
  // ),
  // on(
  //   addWordToUserWordsErrorAction,
  //   (state, action): VocabularyStateInterface => ({
  //     ...state,
  //     isLoading: false,
  //     error: action.error
  //   })
  // ),
  // on(
  //   saveEditedWordAction,
  //   (state): VocabularyStateInterface => ({
  //     ...state,
  //     isCloseWordModal: false,
  //     isLoading: true,
  //     error: null
  //   })
  // ),
  // on(
  //   saveEditedWordSuccessAction,
  //   (state, action): VocabularyStateInterface => ({
  //     ...state,
  //     isLoading: false,
  //     words: action.words,
  //     isCloseWordModal: true
  //   })
  // ),
  // on(
  //   saveEditedWordErrorAction,
  //   (state, action): VocabularyStateInterface => ({
  //     ...state,
  //     isLoading: false,
  //     error: action.error
  //   })
  // ),
  // on(
  //   deleteUserWordAction,
  //   (state): VocabularyStateInterface => ({
  //     ...state,
  //     isCloseWordModal: false,
  //     vocabularyLoader: true,
  //     error: null
  //   })
  // ),
  // on(
  //   deleteUserWordSuccessAction,
  //   (state, action): VocabularyStateInterface => ({
  //     ...state,
  //     vocabularyLoader: false,
  //     words: action.words,
  //   })
  // ),
  // on(
  //   deleteUserWordErrorAction,
  //   (state, action): VocabularyStateInterface => ({
  //     ...state,
  //     vocabularyLoader: false,
  //     error: action.error
  //   })
  // ),
  // on(
  //   setWordAsFavoriteAction,
  //   (state, action): VocabularyStateInterface => ({
  //     ...state,
  //     words: state.words.map(word =>
  //       word._id === action.word._id ?
  //         { ...word, isFavorite: !word.isFavorite } :
  //         word
  //     )
  //   })
  // ),
)

export function vocabularyReducer(state: VocabularyStateInterface, action: Action) {
  return reducers(state, action)
}

