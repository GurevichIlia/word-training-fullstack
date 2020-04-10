import { AuthService } from 'src/app/shared/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //   return this.afAuth.authState.pipe(
    //     take(1),
    //     map(user => {
    //       return !!user;
    //     }),
    //     tap(loggedIn => {
    //       if (!loggedIn) {
    //         console.log('access denied');
    //         this.router.navigate(['/login']);
    //       }
    //     })
    //   );

    // }
    return this.auth.isAuthenticated();

  }
}

