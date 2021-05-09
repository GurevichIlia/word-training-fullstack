import { Word } from './../../../../shared/interfaces';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Verb } from 'src/app/shared/interfaces';
import { CONJUGATION_TEMPLATE_MODEL, ConjugationTemplate } from 'src/app/core/models/verbs.model';
import { VerbTime } from 'src/app/modules/conjugations/models/conjugations.interface';



@Component({
  selector: 'app-verb-card-body',
  templateUrl: './verb-card-body.component.html',
  styleUrls: ['./verb-card-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerbCardBodyComponent {
  verbTableModel: ConjugationTemplate[] = []
  _verb: Verb
  showText = false

  @Input() set verb(verb: Verb) {
    this.showText = false
    this._verb = verb
    this.verbTableModel = CONJUGATION_TEMPLATE_MODEL.map(model => ({ ...model, value: verb.conjugations[this.time][model.pronoun] }))

  }

  @Input() time: VerbTime = 'future'

  masterShowToggle(): void {
    this.showText = !this.showText
  }
}
