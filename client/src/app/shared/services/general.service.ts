import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralState } from './../../general.state';



@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  // updateWords$ = new Subject<void>();

  constructor(
    private generalState: GeneralState

  ) {

  }

  // updateWordList() {
  //   this.updateWords$.next();
  // }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
