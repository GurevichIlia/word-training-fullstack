import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core';
import { GetConjugationsResponse } from '../models/conjugations.interface';

@Injectable({
  providedIn: 'root'
})
export class ConjugationsApiService {

  constructor(private apiService: ApiService) { }


  getConjugationsForVerbs(verbs: string[]): Observable<GetConjugationsResponse> {
    return this.apiService.post(`/api/vocabulary/getConjugationForVerbs`, { verbs });
  }
}
