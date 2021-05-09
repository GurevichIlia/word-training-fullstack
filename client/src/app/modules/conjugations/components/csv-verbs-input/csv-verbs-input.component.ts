import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConjugationsFacade } from '../../conjugations.facade';

@Component({
  selector: 'app-csv-verbs-input',
  templateUrl: './csv-verbs-input.component.html',
  styleUrls: ['./csv-verbs-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsvVerbsInputComponent {
  csvLoading$: Observable<boolean> = this.conjugationsFacade.isLoading$;
  isResetCsvHandlerState$: Observable<boolean> = this.conjugationsFacade.isResetCsvHandlerState$;

  constructor(
    private conjugationsFacade: ConjugationsFacade
  ) { }

  getConjugationsFromCsv(file: File): void {
    this.conjugationsFacade.getConjugationsFromCsv(file)
  }

}
