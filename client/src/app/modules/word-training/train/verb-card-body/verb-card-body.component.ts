import { Word } from './../../../../shared/interfaces';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Conjugation, Verb, VerbTime } from 'src/app/shared/interfaces';

export interface VerbTableModel {
  pronoun: keyof Conjugation
  hebPronoun: string
  value: string
}

const verbTableModel: VerbTableModel[] = [
  {
    pronoun: 'i',
    hebPronoun: 'אני',
    value: ''
  },
  {
    pronoun: 'you_male',
    hebPronoun: 'אַתה',
    value: ''
  },
  {
    pronoun: 'you_female',
    hebPronoun: 'את',
    value: ''
  },
  {
    pronoun: 'he',
    hebPronoun: 'הוא',
    value: ''
  },
  {
    pronoun: 'she',
    hebPronoun: 'היא',
    value: ''
  },
  {
    pronoun: 'we',
    hebPronoun: 'אנחנו',
    value: ''
  },

  {
    pronoun: 'you_plural',
    hebPronoun: 'אתם / אתן',
    value: ''
  },
  {
    pronoun: 'they',
    hebPronoun: 'הם / הן',
    value: ''
  }
]

@Component({
  selector: 'app-verb-card-body',
  templateUrl: './verb-card-body.component.html',
  styleUrls: ['./verb-card-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerbCardBodyComponent {
  verbTableModel: VerbTableModel[] = []
  _verb: Word
  showText = false

  @Input() set verb(verb: Word) {
    this.showText = false
    this._verb = verb
    this.verbTableModel = verbTableModel.map(model => ({ ...model, value: verb.conjugations[this.time][model.pronoun] }))

  }

  @Input() time: VerbTime = 'future'

  masterShowToggle(): void {
    this.showText = !this.showText
  }
}
