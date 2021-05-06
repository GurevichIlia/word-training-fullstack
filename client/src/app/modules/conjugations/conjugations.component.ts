import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ConjugationsFacade } from './conjugations.facade';

@Component({
  selector: 'app-conjugations',
  templateUrl: './conjugations.component.html',
  styleUrls: ['./conjugations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConjugationsComponent implements OnInit {
  isShowUploader = false;

  constructor(
    private conjugationsFacade: ConjugationsFacade
  ) { }

  ngOnInit(): void {
  }

  getConjugationsFromVerbsAsString(verbs: string): void {
    this.conjugationsFacade.getConjugationsFromVerbsAsString(verbs)
  }
}
