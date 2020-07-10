import { Language } from '../../../shared/interfaces';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GeneralFacade } from './../../../general.facade';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  learningLanguage$: Observable<Language>;
  constructor(
    private router: Router,
    private auth: AuthService,
    private generalFacade: GeneralFacade
  ) { }

  ngOnInit() {
    this.getLearningLanguage();
  }

  onChangeLearningLanguage() {
    this.router.navigate(['languages']);
  }

  onLogOut() {
    this.auth.logOut();
  }

  getLearningLanguage() {
    this.learningLanguage$ = this.generalFacade.getCurrentLearningLanguage$();
  }
}
