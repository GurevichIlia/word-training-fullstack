import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Word } from 'src/app/shared/interfaces';
export class VocabularyResolver implements Resolve<Word[]> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Word[]> {
    return
  }
}
