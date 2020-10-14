import { GroupAction } from './../../../core/enums/group';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { finalize, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ALL_WORDS_GROUP } from 'src/app/general.state';
import { WordGroup } from 'src/app/shared/interfaces';
import { VocabularyFacade } from '../vocabulary.facade';
import { GroupMenuItem, groupMenuItems } from './../../../core/models/group.modal';
import { GroupsService } from './../../../core/services/groups.service';
import { NotificationsService } from './../../../shared/services/notifications.service';
import { Action } from 'src/app/core';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent implements OnInit, OnDestroy {
  @ViewChild('groupModal') groupModal: TemplateRef<any>;
  groups$: Observable<WordGroup[]>;
  selectedGroup$: Observable<WordGroup>;
  groupName = new FormControl('', Validators.required);
  isLoading = false;
  subscription$ = new Subject();
  groupModalRef: NbDialogRef<TemplateRef<any>>;
  modalTitle = '';
  menuItems$ = this.groupsService.createMenu(this.vocabularyService.getSelectedGroup$(), groupMenuItems as GroupMenuItem[]);
  constructor(
    private vocabularyService: VocabularyFacade,
    private notification: NotificationsService,
    private groupsService: GroupsService,
    private dialogService: NbDialogService
  ) {

  }

  ngOnInit() {
    this.groups$ = this.vocabularyService.isUpdateGroups().pipe(
      startWith(''),
      switchMap(_ => this.groupsService.getWordsGroups$()),
      tap(groups => console.log('GROUPS', groups))
    );

    this.selectedGroup$ = this.vocabularyService.getSelectedGroup$();
  }

  saveGroup({ isUpdate }: { isUpdate?: boolean }) {
    if (!this.groupName.valid) {
      return this.notification.warning('', 'Please fill in required fields');
    }

    this.isLoading = true;
    this.groupsService.saveGroup(this.groupName.value, isUpdate ? this.vocabularyService.getSelectedGroup() : null)
      .pipe(
        finalize(() => this.isLoading = false),

        takeUntil(this.subscription$))
      .subscribe(group => {
        this.vocabularyService.updateWordsAndGroups();
        this.groupName.patchValue('');
        this.groupModalRef.close();
        this.vocabularyService.setSelectedGroup(group);

        // this.getGroups();
        console.log('RES AFTER SAVE GROUP', group);
      });
  }

  deleteGroup(group: WordGroup) {
    this.groupsService.deleteWordGroup(group)
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(res => {
        this.vocabularyService.updateWordsAndGroups();
        this.vocabularyService.setSelectedGroup(new WordGroup(ALL_WORDS_GROUP));
        // this.getGroups();
        console.log('RES AFTER DELETE GROUP', res);
      })
  }

  openGroupModal(title: 'New group' | 'Edit group') {
    this.modalTitle = title;

    if (title === 'Edit group') {
      this.groupName.patchValue(this.vocabularyService.getSelectedGroup().name);
    }

    this.groupModalRef = this.dialogService.open(this.groupModal);

  }

  getAction(event: Action<WordGroup>) {
    switch (event.action) {
      case GroupAction.NEW_GROUP: this.openGroupModal('New group')

        break;
      case GroupAction.DELETE_GROUP: this.deleteGroup(event.payload)

        break;
      case GroupAction.NEW_GROUP: this.openGroupModal('New group')

        break;
      case GroupAction.NEW_GROUP: this.openGroupModal('New group')

        break;

    }
  }
  // _wordGroups = [];
  // @Input() set wordGroups(wordGroups: WordGroup[]) {
  //   if (wordGroups) {
  //     this._wordGroups = [...wordGroups];

  //   }

  // };
  // @Input() set selectedGroup(group: WordGroup) {
  //   if (group) {
  //     this.groupControl.patchValue(group._id);
  //   }
  // }
  // @Output() selectGroup = new EventEmitter<WordGroup>();

  // groupControl = new FormControl('');



  onSelectGroup(group: WordGroup) {
    this.vocabularyService.setSelectedGroup(group);
  }


  ngOnDestroy() {

  }
}
