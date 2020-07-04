import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class InstallAppService {
  deferredPrompt;
  constructor(private dialog: MatDialog) {


  }

  showInstallSuggestion(e: Event) {
    debugger
    this.deferredPrompt = e;
  }

  installApp() {
    debugger
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
}
