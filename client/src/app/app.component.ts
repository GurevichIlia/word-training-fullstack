import { AuthService } from './shared/services/auth.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'word-training';
  isShowFooterMenu$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isShowFooterMenu$ = this.authService.isAuthenticated$()
  }

}
