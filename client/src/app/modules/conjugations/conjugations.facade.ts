import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConjugationsFacade {
  csvLoading$: Observable<boolean>;
  isResetCsvHandlerState$: Observable<boolean>
  constructor() { }

  getConjugationsFromCsv(file: File): void {

  }
  /**
   *
   * @example verbsAsString: "verb; verb2; verb3"
   */
  getConjugationsFromVerbsAsString(verbs: string): void {

  }
}
