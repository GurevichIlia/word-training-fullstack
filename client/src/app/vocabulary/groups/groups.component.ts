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
  @Input() set selectedGroup(group: WordGroup) {
    if (group) {
      this.groupControl.patchValue(group._id);
    }
  }
  @Output() selectGroup = new EventEmitter<WordGroup>();

  groupControl = new FormControl('');



  onSelectGroup(group: WordGroup) {

    this.selectGroup.emit(group);
  }

}
