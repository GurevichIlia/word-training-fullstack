import { Word, WordGroup } from 'src/app/shared/interfaces';

type WordId = string

export interface IWordTrainingState {
  selectedGroup: WordGroup | null
  words: Word[] | null
  isStarted: boolean,
  nextWord: Word | null,
  previousWordsInCache: Word[],
  levelKnowledgeToShow: number,
  allLearnedCardsQuantity: number,
  uniqueLearnedWords: Map<WordId, Word>;
}
