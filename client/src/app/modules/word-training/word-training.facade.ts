import { WordTrainingService } from './word-training.service';
import { nextWordAction, stopTrainingAction } from './../../store/actions/word-training.actions';
import { NavigationService } from 'src/app/core';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { GroupStatistics } from 'src/app/shared/components/group-statistics/group-statistics.component';
import { GroupStatisticsService } from 'src/app/shared/components/group-statistics/group-statistics.service';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { selectGroupAction, startTrainAction } from 'src/app/store/actions/word-training.actions';
import { AppStateInterface } from 'src/app/store/reducers';
import { groupsSelector } from 'src/app/store/selectors/groups.selectors';
import { configDataSelector, IConfigData, learningWordSelector } from 'src/app/store/selectors/word-training.selector';
import { allWordsSelector } from 'src/app/store/selectors/words.selectors';
import { AppRoutes } from 'src/app/core/routes/routes';
import { CounterState } from './train/train.component';

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
      map((config: IConfigData) => !config.isStarted && config.selectedGroup?.wordQuantity > 0 ? true : false)
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

    return this.uniqueWordsLearned$.pipe(map(uniqueLearnedWords => [...uniqueLearnedWords.values()]))

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

  nextWord(word: Word, levelKnowledge: number): void {
    this.wordTrainingService.startAnimation('bounceInDown');
    this.store$.dispatch(nextWordAction({ word, levelKnowledge }))

  }

  previousWord(): void {
    this.wordTrainingService.startAnimation('bounceInLeft');

  }

  addWordToFavorite(): void {

  }

  stopTrain() {
    this.navigationService.navigateTo(AppRoutes.TrainResult).then(isNavigated => {
      debugger
      this.store$.dispatch(stopTrainingAction())

    })



  }

  resetAnimationState(): void {
    this.wordTrainingService.resetAnimationState();
  }

  selectGroup(group: WordGroup): void {

    if (!group) throw new Error('Group is empty')

    this.store$.dispatch(selectGroupAction({ group }))
  }


}
