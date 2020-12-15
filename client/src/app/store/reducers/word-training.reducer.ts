import { repeatTrainingAction } from './../actions/word-training.actions';
import { Action, createReducer, on } from '@ngrx/store'
import { ReducerNode } from 'src/app/core/enums/store.enum'
import { IWordTrainingState } from 'src/app/core/models/word-training.interfaces'
import { WordTraining } from 'src/app/modules/word-training/classes/WordTraining'
import {
  nextWordAction,
  previousWordAction,
  resetWordTrainingStateAction,
  selectGroupAction,
  startTrainAction,
  stopTrainingAction
} from '../actions/word-training.actions'

export const WORD_TRAINING_REDUCER_NODE: ReducerNode.WORD_TRAINING = ReducerNode.WORD_TRAINING


const initialState: IWordTrainingState = {
  selectedGroup: null,
  words: null,
  isStarted: false,
  nextWord: null,
  previousWordsInCache: [],
  levelKnowledgeToShow: 0,
  allLearnedCardsQuantity: 0,
  uniqueLearnedWords: new Map([])
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
        allLearnedCardsQuantity: 0,
        nextWord: WordTraining.getWordForLearning(state.words, state.previousWordsInCache)
      }
    }
  ),
  on(
    nextWordAction,
    (state, action): IWordTrainingState => {
      const { words, uniqueLearnedWords, allLearnedCardsQuantity } = state
      const lvlKnowledge = action.levelKnowledge
      const currentLearningWord = { ...action.word, levelKnowledge: lvlKnowledge }
      const wordsInCache = [...state.previousWordsInCache, currentLearningWord]
      if (uniqueLearnedWords.has(currentLearningWord._id)) {

        uniqueLearnedWords.delete(currentLearningWord._id)
        uniqueLearnedWords.set(currentLearningWord._id, currentLearningWord)
      } else {
        uniqueLearnedWords.set(currentLearningWord._id, currentLearningWord)
      }
      console.log('UNIQUE WORDS', uniqueLearnedWords.values())
      return {
        ...state,
        words: words.map(word => word._id === currentLearningWord._id ? currentLearningWord : word),
        nextWord: WordTraining.getWordForLearning(words, wordsInCache),
        previousWordsInCache: wordsInCache,
        uniqueLearnedWords,
        allLearnedCardsQuantity: allLearnedCardsQuantity + 1
      }
    }

  ),

  on(
    previousWordAction,
    (state): IWordTrainingState => ({
      ...state,
    })
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
  )
)



export const wordTrainingReducer = (state: IWordTrainingState, action: Action) => {
  return reducer(state, action)
}

// const getRandomIndex = (maxNum: number): number => {
//   return Math.floor(Math.random() * maxNum)
// }

// const getRandomOrder = (words: Word[]): Word[] => {
//   for (let i = words.length - 1; i >= 0; i--) {
//     const j = Math.floor(Math.random() * words.length);
//     const temp = words[i];
//     words[i] = words[j]
//     words[j] = temp;
//   }
//   return words;
// }

// const filterWordByGroup = (words: Word[], selectedGroup: WordGroup): Word[] => {
//   const filtredWords = words.filter(word => word.assignedGroups.includes(selectedGroup._id))

//   return filtredWords
// }

// const removeThreeLastLearnedWords = (words: Word[], previousWordsInCache: Word[]): Word[] => {
//   const length = previousWordsInCache.length;
//   if (length > 0) {
//     const lastIndex = length - 1
//     const thirdFromEndIndex = lastIndex - 2
//     const lastThreeWordsIds: string[] = previousWordsInCache.slice(thirdFromEndIndex, lastIndex).map(word => word._id)

//     const filtredWords = words.filter(word => !lastThreeWordsIds.includes(word._id))

//     return filtredWords
//   }

//   return words
// }

// const getWordForLearning = (words: Word[], previousWordsInCache: Word[]): Word => {

//   words = removeThreeLastLearnedWords(words, previousWordsInCache);

//   const neverLearnedYetWords: Word[] = [] // level knowledge 0
//   const learnedBadWords: Word[] = [] // level knowledge 1,2
//   const otherWords: Word[] = [] // level knowledge 3,4,5

//   words.forEach(word => {
//     if (word.levelKnowledge === 0) {
//       neverLearnedYetWords.push(word)
//     }

//     if (word.levelKnowledge === 1 || word.levelKnowledge === 2) {
//       learnedBadWords.push(word)
//     }

//     if (word.levelKnowledge === 3 || word.levelKnowledge === 4 || word.levelKnowledge === 5) {
//       otherWords.push(word)
//     }
//   })

//   if (neverLearnedYetWords.length > 0) {
//     const randomOrderedWords = getRandomOrder(neverLearnedYetWords)
//     return randomOrderedWords[getRandomIndex(neverLearnedYetWords.length)]

//   }
//   if (learnedBadWords.length > 0) {
//     const randomOrderedWords = getRandomOrder(learnedBadWords)

//     return randomOrderedWords[getRandomIndex(learnedBadWords.length)]

//   }

//   if (otherWords.length > 0) {
//     const randomOrderedWords = getRandomOrder(otherWords)

//     return randomOrderedWords[getRandomIndex(otherWords.length)]
//   }

//   return words[getRandomIndex(words.length)]
// }




