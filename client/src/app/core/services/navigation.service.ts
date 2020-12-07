import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { AppRoutes } from './../routes/routes';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private router: Router
  ) {

  }


  // Use to show current page on the header
  getCurrentLocation$() {
    return this.router.events.pipe(
      startWith(new NavigationEnd(null, '/vocabulary', 'vocabulary')),
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => {

        if (this.isCurrentLocation(e, 'vocabulary')) {
          return 'Vocabulary';
        }

        if (this.isCurrentLocation(e, 'word-training')) {
          debugger
          if (this.isCurrentLocation(e, 'train-result')) {
            return 'Train Result';
          }

          return 'Word training';
        }

        if (this.isCurrentLocation(e, 'general-words')) {
          return 'Shared';
        }

        if (this.isCurrentLocation(e, 'settings')) {

          if (this.isCurrentLocation(e, 'languages')) {
            return 'Languages';
          }

          return 'Settings';
        }
      }))
  }

  private isCurrentLocation(e: NavigationEnd, location: string) {
    return e.urlAfterRedirects.includes(location);
  }

  navigateTo(route: AppRoutes, queryParams: { [key: string]: string } = {}) {
    return this.router.navigate([route], { queryParams })
  }
}
