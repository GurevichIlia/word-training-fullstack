import { openAssigningBottomSheetAction } from './../../../store/actions/words.actions';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, Type, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Action, BackendErrorInterface } from 'src/app/core';
import { AppRoutes } from 'src/app/core/routes/routes';
import { WordGroup } from 'src/app/shared/interfaces';
import { fetchGroupsAction, saveEditedGroupAction } from 'src/app/store/actions/groups.actions';
import { AppStateInterface } from 'src/app/store/reducers';
import { isCloseModalSelector, modalLoaderSelector } from 'src/app/store/selectors/general.selector';
import { groupsSelector } from 'src/app/store/selectors/groups.selectors';
import { GroupAction } from '../../../core/enums/group.enum';
import { AssignWordListComponent } from '../assign-word-list/assign-word-list.component';
import { VocabularyFacade } from '../vocabulary.facade';
import { NavigationService } from './../../../core/services/navigation.service';
import { NotificationsService } from './../../../shared/services/notifications.service';
import { addGroupToUserGroupsAction, deleteUserGroupAction } from './../../../store/actions/groups.actions';
import { GroupMenuItem, groupMenuItems } from './models/group.model';
import { GroupsService } from './services/groups.service';
import { setSelectedGroupAction } from './store/actions/groups.actions';
import { selectedGroupSelector } from './store/selectors/groups.selectors';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent implements OnInit, OnDestroy {
  @ViewChild('groupModal') groupModal: TemplateRef<any>;
  @ViewChild('deleteGroupModal') deleteGroupModal: TemplateRef<any>;
  groups$: Observable<WordGroup[]>;
  selectedGroup: WordGroup;
  groupName = new FormControl('', Validators.required);
  modalLoader$: Observable<boolean>;
  subscription$ = new Subject();
  modalRef: MatDialogRef<TemplateRef<any>>;
  modalTitle = '';
  menuItems$: Observable<GroupMenuItem[]>
  errorMessage$: Observable<string | BackendErrorInterface>
  constructor(
    private vocabularyService: VocabularyFacade,
    private notification: NotificationsService,
    private navigation: NavigationService,
    private groupsService: GroupsService,
    private dialog: MatDialog,
    private store$: Store<AppStateInterface>,
  ) {

  }

  openBottomSheet(): void {
    this.store$.dispatch(openAssigningBottomSheetAction())
  }


  ngOnInit() {
    this.initializeValues()
    this.initializeListeners()
  }

  initializeValues() {
    this.groups$ = this.vocabularyService.isUpdateGroups().pipe(
      startWith(''),
      tap(_ => {
        this.store$.dispatch(fetchGroupsAction())
      }),
      switchMap(_ => this.store$.pipe(select(groupsSelector))),
    );

    this.menuItems$ = this.store$.pipe(
      select(selectedGroupSelector),
      tap(selectedGroup => this.selectedGroup = selectedGroup),
      map(selectedGroup => this.groupsService.createMenu(selectedGroup, groupMenuItems as GroupMenuItem[])),
      tap(groups => console.log('SELECTED GROUP', groups))

    )

    this.modalLoader$ = this.store$.pipe(select(modalLoaderSelector));
  }

  initializeListeners() {
    this.store$.pipe(
      select(isCloseModalSelector),
      tap(isCloseModal => isCloseModal ? this.closeModal() : null),
      takeUntil(this.subscription$))
      .subscribe()
  }

  closeModal() {
    if (this.modalRef) {
      this.groupName.patchValue('');
      this.modalRef.close()
    }
  }

  saveGroup({ isUpdate }: { isUpdate?: boolean }) {
    if (!this.groupName.valid) {
      return this.notification.warning('', 'Please fill in required fields');
    }

    const groupName: string = this.groupName.value

    if (isUpdate) {
      this.store$.dispatch(saveEditedGroupAction({ name: groupName }))
    } else {
      this.store$.dispatch(addGroupToUserGroupsAction({ name: groupName }))

    }
  }

  deleteGroup() {
    this.store$.dispatch(deleteUserGroupAction())
    // this.groupsService.deleteWordGroup(group)
    //   .pipe(
    //     takeUntil(this.subscription$))
    //   .subscribe(res => {
    //     this.vocabularyService.updateWordsAndGroups();
    //     this.store$.dispatch(setSelectedGroupAction({ group: new WordGroup(ALL_WORDS_GROUP) }))
    //     // this.getGroups();
    //     console.log('RES AFTER DELETE GROUP', res);
    //   })
  }

  openGroupModal(title: 'New group' | 'Edit group') {

    if (title === 'Edit group') {
      this.groupName.patchValue(this.selectedGroup.name);
    }

    this.openModal(title, this.groupModal)

  }

  openDeleteModal() {

    this.openModal('Would you like to delete this group?', this.deleteGroupModal);


    // this.openModal(`Would you like to remove this word?`, this.deleteWordTemplate)
  }

  openModal(title: string, template: TemplateRef<any> | Type<any>, item?: string) {
    this.modalTitle = title;
    this.modalRef = this.dialog.open(template, { disableClose: true });

  }

  getAction(event: Action<WordGroup>) {
    switch (event.action) {
      case GroupAction.NEW_GROUP: this.openGroupModal('New group')

        break;
      case GroupAction.DELETE_GROUP: this.openDeleteModal()

        break;
      case GroupAction.ADD_WORDS_TO_GROUP: this.showWordsForAssign()

        break;
      case GroupAction.EDIT_GROUP: this.openGroupModal('Edit group')

        break;

    }
  }

  showWordsForAssign() {
    // tslint:disable-next-line: max-line-length
    // this.dialog.open(AssignWordListComponent);
    this.openBottomSheet()
    // this.navigation.navigateTo(AppRoutes.AddWordsToGroup)
  }

  onSelectGroup(group: WordGroup) {
    this.store$.dispatch(setSelectedGroupAction({ group }))
    // this.vocabularyService.setSelectedGroup(group);
  }


  ngOnDestroy() {

  }
}
