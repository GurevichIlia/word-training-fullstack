import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { NavigationService } from 'src/app/core';
import { AppRoutes } from 'src/app/core/routes/routes';
import { GroupStatistics } from 'src/app/shared/components/group-statistics/group-statistics.component';
import { GroupStatisticsService } from 'src/app/shared/components/group-statistics/group-statistics.service';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { addWordToFavoriteAction, selectGroupAction, startTrainAction } from 'src/app/store/actions/word-training.actions';
import { AppStateInterface } from 'src/app/store/reducers';
import { allWordsSelector, groupsSelector } from 'src/app/store/selectors/vocabulary.selectors';
import { configDataSelector, IConfigData, isShowPreviousWordButtonSelector, learningWordSelector } from 'src/app/store/selectors/word-training.selector';
import {
  changeGroupAction, nextWordAction,





  previousWordAction, repeatTrainingAction, resetWordTrainingStateAction, saveTrainingProgressAction, stopTrainingAction
} from './../../store/actions/word-training.actions';
import { CounterState } from './train/train.component';
import { WordTrainingService } from './word-training.service';

@Injectable()
export class WordTrainingFacade {
  constructor(
    private store$: Store<AppStateInterface>,
    private groupStatisticsService: GroupStatisticsService,
    private utilsService: UtilsService,
    private navigationService: NavigationService,
    private wordTrainingService: WordTrainingService
  ) { }

  get configData$(): Observable<IConfigData> {
    return this.store$.pipe(select(configDataSelector))

  }

  get wordForLearning$(): Observable<Word> {
    return this.store$.pipe(select(learningWordSelector))
  }

  get isAllowedStart$(): Observable<boolean> {
    return this.store$.pipe(
      select(configDataSelector),
      map((config: IConfigData) => !config.isStarted && config.selectedGroup?.wordQuantity > 4 ? true : false)
    )

  }

  get selectedGroup$(): Observable<WordGroup> {
    return this.store$.pipe(
      select(configDataSelector),
      map((config: IConfigData) => config.selectedGroup))

  }

  get groups$(): Observable<WordGroup[]> {
    const ALL_WORDS = 0
    return this.store$.pipe(select(groupsSelector),
      filter(groups => groups !== null),
      tap(groups => this.selectGroup(groups[ALL_WORDS])))
  }

  get allWords$(): Observable<Word[]> {
    return this.store$.pipe(select(allWordsSelector))
  }

  get wordsInGroup$(): Observable<Word[]> {
    const wordsByGroup$ = this.utilsService.filterByGroup(this.allWords$, this.selectedGroup$)
    return wordsByGroup$
  }

  get groupStatistics$(): Observable<GroupStatistics> {
    return this.groupStatisticsService.getGroupStatistics(this.wordsInGroup$)
  }

  get animationState$(): Observable<string> {
    return this.wordTrainingService.getAnimationState()

  }

  get counterState$(): Observable<CounterState> {
    return combineLatest([
      this.totalLearnedCards$,
      this.uniqueWordsLearned$.pipe(map(uniqueLearnedWords => uniqueLearnedWords.size)),
      this.wordsInGroup$
    ]).pipe(
      map(([totalLearnedCards, uniqueWordsLearned, wordsInGroup]) => ({ totalLearnedCards, uniqueWordsLearned, wordsInGroup }))
    )
  }

  get totalLearnedCards$(): Observable<number> {
    return this.store$.pipe(
      select(configDataSelector),
      map((config: IConfigData) => config.allLearnedCardsQuantity))
  }

  get uniqueWordsLearned$(): Observable<Map<string, Word>> {
    return this.store$.pipe(
      select(configDataSelector),
      map((config: IConfigData) => config.uniqueLearnedWords))
  }

  get trainingResult$(): Observable<Word[]> {

    // return this.uniqueWordsLearned$.pipe(map(uniqueLearnedWords => [...uniqueLearnedWords.values()]))
    return this.wordsInGroup$.pipe(map(words => words))

  }

  get isShowPreviousWordButton$(): Observable<boolean> {
    return this.store$.pipe(select(isShowPreviousWordButtonSelector))
  }

  get trainResultStatistics$(): Observable<GroupStatistics> {
    return this.groupStatisticsService.getGroupStatistics(this.trainingResult$)
  }

  get isStartedTrain$(): Observable<boolean> {
    return this.store$.pipe(
      select(configDataSelector),
      map((config: IConfigData) => config.isStarted)
    )
  }

  startTrain(words: Word[]): void {
    this.wordTrainingService.getAnimationState()
    this.wordTrainingService.startAnimation('bounceInDown');
    this.store$.dispatch(startTrainAction({ words }))
    this.navigationService.navigateTo(AppRoutes.Training)
  }

  repeatTraining() {
    this.store$.dispatch(repeatTrainingAction())
    this.navigationService.navigateTo(AppRoutes.Training)
  }

  changeGroupForTraining() {
    this.store$.dispatch(changeGroupAction())
    this.navigationService.navigateTo(AppRoutes.SelectGroupForTraining)
  }

  nextWord(word: Word, levelKnowledge: number): void {
    this.wordTrainingService.startAnimation('bounceInDown');
    this.store$.dispatch(nextWordAction({ word, levelKnowledge }))

  }

  previousWord(): void {
    this.store$.dispatch(previousWordAction())

    this.wordTrainingService.startAnimation('bounceInLeft');

  }

  addWordToFavorite(word: Word): void {
    this.store$.dispatch(addWordToFavoriteAction({ word }))
  }

  stopTrain(): void {
    this.saveProgress();
    this.navigationService.navigateTo(AppRoutes.TrainResult).then(isNavigated => {
      this.store$.dispatch(stopTrainingAction())

    })
  }

  saveProgress(): void {
    this.store$.dispatch(saveTrainingProgressAction())
  }

  resetAnimationState(): void {
    this.wordTrainingService.resetAnimationState();
  }

  selectGroup(group: WordGroup): void {

    this.store$.dispatch(selectGroupAction({ group }))
  }

  resetWordTrainingState(): void {
    this.store$.dispatch(resetWordTrainingStateAction())
  }
}
