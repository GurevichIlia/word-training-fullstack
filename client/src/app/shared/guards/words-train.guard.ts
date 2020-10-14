import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { GeneralState } from './../../general.state';
import { NotificationsService } from './../services/notifications.service';


@Injectable({
  providedIn: 'root'
})
export class WordsTrainGuard implements CanActivate {

  constructor(
    private generalState: GeneralState,
    private router: Router,
    private notifications: NotificationsService
  ) {

  }
  canActivate() {
    let canActive = false;
    return this.generalState.getUserWords$().pipe(
      take(1),
      map(words => {
        console.log('GUARD TRAIN', words);
        if (words.length >= 5) {
          canActive = true;
        } else {
          canActive = false;
          this.notifications.info('', 'Please add minimum 5 words')
          this.router.navigate(['vocabulary']);

        }
        return canActive;
      })
    );
  }
}
