import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TrainComponent } from 'src/app/modules/word-training/train/train.component';

@Injectable({
  providedIn: 'root'
})
export class StopWordsTrainGuard implements CanDeactivate<TrainComponent> {

  canDeactivate(component: TrainComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (confirm('Do you want to stop training?')) {

      return true;
    }

    return false;
  }


}
