import { Pipe, PipeTransform } from '@angular/core';
import { ConjugationTemplate, CONJUGATION_TEMPLATE_MODEL } from 'src/app/core/models/verbs.model';
import { Conjugation } from 'src/app/modules/conjugations/models/conjugations.interface';

@Pipe({
  name: 'conjugationTemplate'
})
export class ConjugationTemplatePipe implements PipeTransform {

  transform(conjugation: Conjugation): ConjugationTemplate[] {
    const templates = CONJUGATION_TEMPLATE_MODEL.map(model => ({ ...model, value: conjugation[model.pronoun] }))

    return templates
  }

}
