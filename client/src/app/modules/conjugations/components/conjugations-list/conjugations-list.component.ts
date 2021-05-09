import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ConjugationsFacade } from '../../conjugations.facade';
import { VerbWithConjugations } from '../../models/conjugations.interface';

@Component({
  selector: 'app-conjugations-list',
  templateUrl: './conjugations-list.component.html',
  styleUrls: ['./conjugations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConjugationsListComponent implements OnInit {
  verbs$: Observable<VerbWithConjugations[]> = this.conjugationsFacade.verbs$
  constructor(
    private conjugationsFacade: ConjugationsFacade
  ) { }

  ngOnInit(): void {
  }

}
