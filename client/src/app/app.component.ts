import { AuthService } from './shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable, fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'word-training';
  isShowFooterMenu$: Observable<boolean>;
  subscription$ = new Subject();
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isShowFooterMenu$ = this.authService.isAuthenticated$();
  }

  ngOnInit() {
    const beforeinstallprompt$ = fromEvent(window, 'beforeinstallprompt');
    beforeinstallprompt$
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe(e => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        // Update UI notify the user they can install the PWA
        console.log(e, 'BEFORE INSTALL');
      });



  }



}
