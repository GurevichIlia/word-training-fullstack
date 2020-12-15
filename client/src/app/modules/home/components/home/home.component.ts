import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { GeneralFacade } from 'src/app/general.facade';
import { AppStateInterface } from 'src/app/store/reducers';
import { globalLoaderSelector } from 'src/app/store/selectors/general.selector';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  globalLoader$: Observable<boolean>

  // currentLearningLanguage
  constructor(
    private generaFacade: GeneralFacade,
    private router: Router,
    private store$: Store<AppStateInterface>

  ) {
  }

  ngOnInit() {
    this.globalLoader$ = this.store$.pipe(select(globalLoaderSelector))

  }
}
