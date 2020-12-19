import { isTrainStartedSelector } from './../../store/selectors/word-training.selector';
import { WordTrainingFacade } from './../../modules/word-training/word-training.facade';
import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TrainComponent } from 'src/app/modules/word-training/train/train.component';
import { AppStateInterface } from 'src/app/store/reducers';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StopWordsTrainGuard implements CanDeactivate<TrainComponent> {
  constructor(
    private store$: Store<AppStateInterface>,

  ) { }

  canDeactivate(component: TrainComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.store$.pipe(select(isTrainStartedSelector), map(isStarted => {
      if (isStarted) {
        if (confirm('Do you want to stop training?')) {

          return true;
        }

        return false;
      }

      return true
    }))


  }


}
