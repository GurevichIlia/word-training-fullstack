import { GeneralFacade } from 'src/app/general.facade';
import { NotificationsService } from './../services/notifications.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LanguagesService } from './../../languages/languages.service';

@Injectable({
  providedIn: 'root'
})
export class SelectLanguageGuardGuard implements CanActivate {

  constructor(
    private generalFacade: GeneralFacade,
    private router: Router,
    private notification: NotificationsService) {


  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let canActive = false;
    return this.generalFacade.getCurrentLearningLanguage$().pipe(
      take(1),
      map(lang => {
        console.log('GUARD LANG', lang);
        if (lang) {
          canActive = true;
        } else {
          this.router.navigate(['/languages']);
          this.notification.success('Select learning language');
          canActive = false;
        }
        return canActive;
      })
    );
  }

}
