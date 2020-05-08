import { WordGroup } from './../../shared/interfaces';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent {
  @Input() wordGroups: WordGroup[];
  // @Input() set selectedGroup(groupId: string) {
  //   if (groupId) {
  //     this.groupControl.patchValue(groupId)

  //   }
  // }
  @Output() selectGroup = new EventEmitter();

  groupControl = new FormControl('1');



  onSelectGroup() {
    this.selectGroup.emit(this.groupControl.value);
  }

}
