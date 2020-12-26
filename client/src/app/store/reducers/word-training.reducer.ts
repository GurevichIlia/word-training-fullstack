import { Action, createReducer, on } from '@ngrx/store';
import { ReducerNode } from 'src/app/core/enums/store.enum';
import { IWordTrainingState } from 'src/app/core/models/word-training.interfaces';
import { WordTraining } from 'src/app/modules/word-training/classes/WordTraining';
import {
  nextWordAction,

  resetWordTrainingStateAction,
  saveTrainingProgressAction,
  selectGroupAction,
  startTrainAction,
  stopTrainingAction
} from '../actions/word-training.actions';
import { addWordToFavoriteAction, changeGroupAction, previousWordAction, repeatTrainingAction } from './../actions/word-training.actions';

export const WORD_TRAINING_REDUCER_NODE: ReducerNode.WORD_TRAINING = ReducerNode.WORD_TRAINING


const initialState: IWordTrainingState = {
  selectedGroup: null,
  words: null,
  isStarted: false,
  nextWord: null,
  previousWordsInCache: [],
  allLearnedCardsQuantity: 0,
  uniqueLearnedWords: new Map([]),
  newWordsLearnedInTrain: new Map([])
}

export const reducer = createReducer(
  initialState,
  on(
    selectGroupAction,
    (state, action): IWordTrainingState => ({
      ...state,
      selectedGroup: action.group
    })
  ),
  on(
    startTrainAction,
    (state, action): IWordTrainingState => {
      const filtredWords = WordTraining.filterWordsByGroup(action.words, state.selectedGroup)
      const alreadyLearnedWords = new Map()
      filtredWords.forEach(word => word.levelKnowledge > 0 ? alreadyLearnedWords.set(word._id, word) : null)
      return {
        ...state,
        previousWordsInCache: [],
        words: filtredWords,
        uniqueLearnedWords: alreadyLearnedWords,
        isStarted: true,
        nextWord: WordTraining.getWordForLearning(filtredWords, state.previousWordsInCache)
      }
    }
  ),
  on(
    repeatTrainingAction,
    (state, action): IWordTrainingState => {
      return {
        ...state,
        isStarted: true,
        previousWordsInCache: [],
        allLearnedCardsQuantity: 0,
        nextWord: WordTraining.getWordForLearning(state.words, state.previousWordsInCache)
      }
    }
  ),
  on(
    changeGroupAction,
    (state, action): IWordTrainingState => {
      return {
        ...state,
        allLearnedCardsQuantity: 0,
      }
    }
  ),
  on(
    nextWordAction,
    (state, action): IWordTrainingState => {
      const { words, uniqueLearnedWords, allLearnedCardsQuantity, newWordsLearnedInTrain } = state
      const lvlKnowledge = action.levelKnowledge
      const currentLearningWord = { ...action.word, levelKnowledge: lvlKnowledge }
      const wordsInCache = [...state.previousWordsInCache, currentLearningWord]

      if (uniqueLearnedWords.has(currentLearningWord._id)) {

        uniqueLearnedWords.delete(currentLearningWord._id)
        uniqueLearnedWords.set(currentLearningWord._id, currentLearningWord)
      } else {
        uniqueLearnedWords.set(currentLearningWord._id, currentLearningWord)
      }

      if (newWordsLearnedInTrain.has(currentLearningWord._id)) {

        newWordsLearnedInTrain.delete(currentLearningWord._id)
        newWordsLearnedInTrain.set(currentLearningWord._id, currentLearningWord)
      } else {
        newWordsLearnedInTrain.set(currentLearningWord._id, currentLearningWord)
      }

      return {
        ...state,
        words: words.map(word => word._id === currentLearningWord._id ? currentLearningWord : word),
        nextWord: WordTraining.getWordForLearning(words, wordsInCache),
        previousWordsInCache: wordsInCache,
        uniqueLearnedWords,
        newWordsLearnedInTrain,
        allLearnedCardsQuantity: allLearnedCardsQuantity + 1
      }
    }

  ),

  on(
    previousWordAction,
    (state): IWordTrainingState => {
      const learnedWordsInCache = [...state.previousWordsInCache]

      const previousWord = learnedWordsInCache.pop()

      return {
        ...state,
        nextWord: previousWord || state.nextWord,
        previousWordsInCache: learnedWordsInCache
      }
    }
  ),
  on(
    stopTrainingAction,
    (state): IWordTrainingState => ({
      ...state,
      isStarted: false,
    })
  ),
  on(
    resetWordTrainingStateAction,
    (state): IWordTrainingState => ({
      ...state,
      ...initialState

    })
  ),
  on(
    addWordToFavoriteAction,
    (state, action): IWordTrainingState => ({
      ...state,
      words: state.words.map(word => {
        return word._id === action.word._id ? { ...word, isFavorite: !word.isFavorite } : word
      }),
      nextWord: { ...state.nextWord, isFavorite: !state.nextWord.isFavorite }

    })
  ),
  on(
    resetWordTrainingStateAction,
    (state): IWordTrainingState => ({
      ...state,
      ...initialState

    })
  ),
  // on(
  //   saveTrainingProgressAction,
  //   (state, action): IWordTrainingState => ({
  //     ...state,
  //   })
  // ),
)



export const wordTrainingReducer = (state: IWordTrainingState, action: Action) => {
  return reducer(state, action)
}



