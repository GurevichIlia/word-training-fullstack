import { WordGroup } from './../../shared/interfaces';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent {
  _wordGroups = [];
  @Input() set wordGroups(wordGroups: WordGroup[]) {
    if (wordGroups) {
      this._wordGroups = [...wordGroups];

    }

  };
  @Input() set selectedGroup(groupId: string) {
    if (groupId) {
      this.groupControl.patchValue(groupId);

    }
  }
  @Output() selectGroup = new EventEmitter();

  groupControl = new FormControl('');



  onSelectGroup() {

    this.selectGroup.emit(this.groupControl.value);
  }

}
