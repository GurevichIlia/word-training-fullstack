import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { VerbTableModel } from '../verb-card-body/verb-card-body.component';

@Component({
  selector: 'app-verb-table-row',
  templateUrl: './verb-table-row.component.html',
  styleUrls: ['./verb-table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerbTableRowComponent implements OnInit {
  @Input() conjugation: VerbTableModel
  @Input() showText = false
  constructor() { }

  ngOnInit() {
  }

  showToggle() {
    this.showText = !this.showText
  }
}
