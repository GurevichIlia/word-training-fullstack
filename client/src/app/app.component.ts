import { AuthService } from './shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'word-training';
  isShowFooterMenu$: Observable<boolean>;
  deferredPrompt
  constructor(private authService: AuthService) {
    this.isShowFooterMenu$ = this.authService.isAuthenticated$();
  }

  ngOnInit() {



    const isAlreadyInstalled$ = fromEvent(window, 'appinstalled');

    isAlreadyInstalled$.subscribe(res => console.log(res, 'INSTALLED'))


  }
  installApp() {
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    });
  }

  showInstallPromotion() {
    console.log('SHOW PROMOTION');
  }
}
