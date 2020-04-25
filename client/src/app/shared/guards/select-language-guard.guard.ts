import { LanguagesService } from './../../languages/languages.service';
import { GeneralService } from './../services/general.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SelectLanguageGuardGuard implements CanActivate {

  constructor(
    private languageService: LanguagesService,
    private router: Router) {


  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let canActive = false;
    return this.languageService.getCurrentLanguage$().pipe(
      take(1),
      map(lang => {
        console.log('GUARD LANG', lang);
        if (lang) {
          canActive = true;
        } else {
          canActive = false;
        }
        return canActive;
      })
    );
  }

}
