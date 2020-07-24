import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

export class Translation {

  constructor(
    public q: string,
    public target: string,
  ) {

  }
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(
    private api: ApiService
  ) {
  }


  // onTranslate(translation: Translation = new Translation('hello', 'ru')) {
  //   const key = 'AIzaSyAnmekRfEZy4zAzc8raaCYcN-A3ywd9LM0';
  //   this.api.post(`https://translation.googleapis.com/language/translate/v2?key=${key}`, translation).subscribe(res => console.log(res))
  // }
}
