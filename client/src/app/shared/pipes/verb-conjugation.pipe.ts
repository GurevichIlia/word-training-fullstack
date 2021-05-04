import { Pipe, PipeTransform } from '@angular/core';
import { Conjugation, Verb, VerbTime } from '../interfaces';

@Pipe({
  name: 'verbConjugation'
})
export class VerbConjugationPipe implements PipeTransform {

  transform(verb: Verb, time: VerbTime, pronoun: keyof Conjugation): any {
    return verb.conjugations[time][pronoun];
  }

}
