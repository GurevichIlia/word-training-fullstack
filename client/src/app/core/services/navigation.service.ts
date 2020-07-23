import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) {

  }



  getCurrentLocation$() {
    return this.router.events.pipe(
      startWith(new NavigationEnd(null, '/vocabulary', 'vocabulary')),
      map(e => {

        if (e instanceof NavigationEnd) {
          if (this.isCurrentLocation(e, 'vocabulary')) {
            return 'Vocabulary';
          }

          if (this.isCurrentLocation(e, 'word-training')) {
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


        }
      }))
  }

  private isCurrentLocation(e: NavigationEnd, location: string) {
    return e.urlAfterRedirects.includes(location);
  }
}
