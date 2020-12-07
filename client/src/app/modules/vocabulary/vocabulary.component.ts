import { isOpenWordsToAssignSelector } from './../../store/selectors/words.selectors';
import { shareWordToGeneralWordsAction } from './../../store/actions/words.actions';
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, Type, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, map, shareReplay, startWith, takeUntil, tap } from 'rxjs/operators';
import { Action } from 'src/app/core';
import { wordMenuItems } from 'src/app/core/models/vocabulary.model';
import { GroupStatistics } from 'src/app/shared/components/group-statistics/group-statistics.component';
import { Word } from 'src/app/shared/interfaces';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import {
  addWordToUserWordsAction,
  deleteUserWordAction,
  fetchWordsAction,
  saveEditedWordAction,
  setWordAsFavoriteAction
} from 'src/app/store/actions/words.actions';
import { errorSelector, isCloseModalSelector, modalLoaderSelector } from 'src/app/store/selectors/general.selector';
import {
  allWordsSelector, isCloseWordsToAssignSelector
} from 'src/app/store/selectors/words.selectors';
import { WordAction } from '../../core/enums/word.enum';
import { BackendErrorInterface } from './../../core/models/general.model';
import { WordGroup } from './../../shared/interfaces';
import { AppStateInterface } from './../../store/reducers';
import { selectedGroupSelector } from './groups/store/selectors/groups.selectors';
import { VocabularyFacade } from './vocabulary.facade';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AssignWordListComponent } from './assign-word-list/assign-word-list.component';




@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss']
})
export class VocabularyComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modalUiWrapper') wordModalRef: TemplateRef<any>;
  @ViewChild('wordFormTemplate') wordModalTemplate: TemplateRef<any>;
  @ViewChild('deleteWordModal') deleteWordModal: TemplateRef<any>;
  selectedGroup$: Observable<WordGroup>
  wordForm: FormGroup;
  addWordByList: string;
  searchValueControl = new FormControl('');
  subscription$ = new Subject();
  titleForModal: string;
  modalRef: MatDialogRef<any>;
  wordMenuItems = wordMenuItems;


  selectedWordsForAssignGroups$ = new BehaviorSubject<string[]>([]);
  loader = false;

  groupStatistics$: Observable<GroupStatistics>;
  isShowUploader = false;

  userWords$: Observable<Word[]>;
  userWordsFiltredByGroupAndSearchValue$: Observable<Word[]>;

  groups$: Observable<WordGroup[]>;

  // globalLoader$: Observable<boolean>
  errorMessage$: Observable<string | BackendErrorInterface>
  modalLoader$: Observable<boolean>
  modalContext: TemplateRef<any>

  wordToDelete: Word;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NotificationsService,
    private vocabularyFacade: VocabularyFacade,
    private dialog: MatDialog,
    private store$: Store<AppStateInterface>,
    private _bottomSheet: MatBottomSheet

  ) { }

  ngOnInit() {
    this.fetchData();
    this.initializeValues()
    this.initializeListeners()

    this.showInstallAppSuggestion();
    this.detectDevice();
  }

  fetchData() {
    this.store$.dispatch(fetchWordsAction())
  }

  initializeValues() {
    this.wordFormInitial();
    this.userWords$ = this.store$.pipe(select(allWordsSelector), shareReplay(), tap(words => console.log('WORDS AFTER FAVORITE', words)));
    this.modalLoader$ = this.store$.pipe(select(modalLoaderSelector))
    this.selectedGroup$ = this.store$.pipe(select(selectedGroupSelector))
    this.errorMessage$ = this.store$.pipe(select(errorSelector))


    this.userWordsFiltredByGroupAndSearchValue$ =
      combineLatest([
        this.searchValueControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
        this.userWords$,
        this.selectedGroup$
      ])
        .pipe(
          map(([searchValue, words, selectedGroup]) => {
            return this.vocabularyFacade.getUserWordsFiltredByGroup(searchValue, words, selectedGroup)
          }))
    // this.userWords$.pipe(
    //   switchMap(_ =>
    //     this.vocabularyFacade.getUserWordsFiltredByGroup(

    //     )
    //   )
    // )

    // this.globalLoader$ = this.store$.pipe(select(globalLoaderSelector))

    // this.vocabularyLoader$ = this.store$.pipe(select(vocabularyLoaderSelector))


    // this.vocabularyFacade.getUserWordsFiltredByGroup(
    //   this.searchValueControl.valueChanges,
    //   this.allWords$,
    //   this.selectedGroup$
    // )
    //   .pipe(
    //     tap(words => console.log('WORDS IN VOCABULARY', words)),
    //     tap(words => this.wordsFiltredByGroup = words),
    //     takeUntil(this.subscription$))
    //   .subscribe()
    this.groupStatistics$ = this.vocabularyFacade.getGroupStatistics(
      this.userWordsFiltredByGroupAndSearchValue$).pipe(tap(words => console.log('WORDS FOR STATISTICS', words)));

  }

  initializeListeners() {
    this.store$.pipe(
      select(isCloseModalSelector),
      tap(isCloseModal => isCloseModal ? this.closeWordModal() : null),
      takeUntil(this.subscription$))
      .subscribe()

    this.store$.pipe(
      select(isOpenWordsToAssignSelector),
      tap(isOpen => isOpen ? this.openAssignWordsList() : null),
      takeUntil(this.subscription$))
      .subscribe()
  }

  ngAfterViewInit() {

  }

  // getGroupStatistics() {
  //   this.statistics$ = this.vocabularyFacade.getGroupStatistics(of(this.wordsFiltredByGroup));
  // }

  // getWordsFilteredByGroup(): void {
  //   this.getGroupStatistics();
  // }

  // getUserGroups() {
  //   this.vocabularyFacade.getWordsGroups()
  //     .pipe(
  //       take(1),
  //       takeUntil(this.subscription$)

  //     ).subscribe(() => console.log('USER GROUPS GOT'));
  // }

  // getWordsGroups() {

  //   this.wordGroups$ = this.vocabularyFacade.getWordsGroups();

  // }

  wordFormInitial() {
    this.wordForm = this.fb.group({
      word: ['', Validators.required],
      translation: ['', Validators.required],
      _id: [''],
      isFavorite: [false]
    });
  }

  toTrainWords() {
    this.router.navigate(['word-training']);
  }

  addNewWord() {
    if (this.wordForm.valid) {

      const word: Word = this.wordForm.value

      this.store$.dispatch(addWordToUserWordsAction({ word }))

      // this.vocabularyFacade.addNewWord(this.wordForm.value)
      //   .pipe(
      //     finalize(() => this.isLoading = false),
      //     takeUntil(this.subscription$)
      //   )
      //   .subscribe(word => {
      //     if (word) {
      //       this.notification.success('', 'Word added');
      //       this.closeWordModal();
      //       // this.vocabularyFacade.updateWordsAndGroups();
      //       // this.getWordsGroups();

      //     }
      //   }, err => this.notification.error('', err.message.error));

    } else {
      this.notification.warning('', 'Please fill in required fields');
    }
  }

  updateWord() {

    if (this.wordForm.valid) {

      const editedWord: Word = this.wordForm.value

      this.store$.dispatch(saveEditedWordAction({ word: editedWord }))

    } else {
      this.notification.warning('', 'Please fill in required fields');
    }
    // this.vocabularyFacade.onEdit(editeWord);
    // if (editeWord) {
    //   this.isLoading = true;
    //   this.vocabularyFacade.updateWord(editeWord);
    //   this.vocabularyFacade.editWord(editeWord)
    //     .pipe(
    //       finalize(() => this.isLoading = false),
    //       takeUntil(this.subscription$)
    //     )
    //     .subscribe(editedWord => {
    //       if (editedWord) {
    //         this.closeWordModal();
    //         // this.vocabularyFacade.updateWordsAndGroups();
    //       }
    //     }, err => {
    //       // this.vocabularyFacade.onEdit(oldValue);
    //       this.notification.error('', err.message.error);
    //     });
    // }
  }

  openAssignWordsList() {
    this._bottomSheet.open(AssignWordListComponent, { panelClass: ['p-0', 'mat-bottom-sheet'], disableClose: true });

  }


  openEditModal(word: Word) {
    this.wordForm.patchValue({
      word: word.word,
      translation: word.translation,
      _id: word._id,
      isFavorite: word.isFavorite
    });
    this.openModal('Edit word', this.wordModalRef);
  }

  openDeleteModal(word: Word) {
    this.wordForm.patchValue({
      word: word.word,
      translation: word.translation,
      _id: word._id,
      isFavorite: word.isFavorite
    });

    this.openModal('Would you like to delete this word?', this.deleteWordModal);


    // this.openModal(`Would you like to remove this word?`, this.deleteWordTemplate)
  }


  setAsFavorite(word: Word) {
    if (word) {
      this.store$.dispatch(setWordAsFavoriteAction({ word }))
    }

  }

  // trackWords(index, word: Word) {
  //   if (!word) {
  //     return null;
  //   } else {
  //     return word._id;
  //   }
  // }

  getActionFromChildren(event: Action<Word>) {
    switch (event.action) {
      case WordAction.SHARE_FOR_ALL: this.shareWordsForAll([event.payload]);
        break
      case WordAction.TO_FAVORITE: this.setAsFavorite(event.payload);
        break
      case WordAction.DELETE_WORD: this.openDeleteModal(event.payload);
        break;
      case WordAction.EDIT_WORD: this.openEditModal(event.payload);
        break;
      default:
        break;
    }
  }





  deleteWord() {
    const word: Word = this.wordForm.value

    this.store$.dispatch(deleteUserWordAction({ word }))
    // // tslint:disable-next-line: max-line-length
    // const title = `Would you like to remove word ${word.word} ?`;
    // const result$ = this.vocabularyFacade.askQuestion(title);

    // result$.onClose.pipe(
    //   switchMap(res => {
    //     if (res) {
    //       // this.vocabularyFacade.deleteWord(word);
    //       return this.vocabularyFacade.deleteWordFromServer(word._id);
    //     } else {
    //       return EMPTY;
    //     }
    //   }),
    //   takeUntil(this.subscription$)
    // )
    // this.openModal(`Would you like to remove this word?`, ModalUiComponent, word.word);

    // this.modalRef.onClose.pipe(
    //   tap(answer => answer ? this.store$.dispatch(deleteUserWordAction({ word })) : null),
    //   takeUntil(this.subscription$)
    // ).subscribe()
  }
  // this.vocabularyFacade.deleteWordFromServer(word)
  //   .pipe(
  //     takeUntil(this.subscription$))
  //   .subscribe(res => {
  //     // this.notification.success('', `Word ${word.word} removed`);
  //     this.notification.success('Removed');
  //     this.vocabularyFacade.updateWordsAndGroups();
  //     // this.getWords();
  //   }, err => {
  //     this.notification.error('', err.error.message);
  //   });



  openModal(title: string, template: TemplateRef<any> | Type<any>, item?: string) {
    this.titleForModal = title;
    this.modalRef = this.dialog.open(template, { disableClose: true });
  }

  closeWordModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalContext = null
      this.wordForm.reset();
    }
  }

  // saveGroup(selectedGroup?: WordGroup) {
  //   if (!this.groupName.valid) {
  //     return this.notification.warning('', 'Please fill in required fields');

  //   }

  //   this.isLoading = true;
  //   this.vocabularyFacade.saveGroup(this.groupName.value, selectedGroup)
  //     .pipe(
  //       finalize(() => this.isLoading = false),

  //       takeUntil(this.subscription$))
  //     .subscribe(group => {
  //       this.vocabularyFacade.updateWordsAndGroups();
  //       this.groupName.patchValue('');
  //       this.groupModal.close();
  //       this.selectedGroup$.next(group);

  //       // this.getGroups();
  //       console.log('RES AFTER SAVE GROUP', group);
  //     });
  // }

  // deleteWordGroup(groupId: string, groups: WordGroup[]) {

  //   this.vocabularyFacade.deleteWordGroup(groupId, groups)
  //     .pipe(takeUntil(this.subscription$))
  //     .subscribe(res => {
  //       this.vocabularyFacade.updateWordsAndGroups();
  //       this.selectedGroup$.next(new WordGroup(ALL_WORDS_GROUP));
  //       // this.getGroups();
  //       console.log('RES AFTER DELETE GROUP', res);
  //     })
  // }

  // setSelectedGroup(group: WordGroup) {
  //   this.selectedGroup$.next(group);
  // }

  // getSelectedGroup() {
  //   return this.selectedGroup$.getValue();
  // }

  // openGroupModal(title: 'New group' | 'Edit group') {
  //   this.titleForModal = title;

  //   if (title === 'Edit group') {
  //     this.groupName.patchValue(this.getSelectedGroup().name);
  //   }

  //   this.groupModal = this.dialogService.open(this.groupModalRef);

  // }

  // showWordsForAssign() {
  //   // tslint:disable-next-line: max-line-length
  //   this.dialog.open(AssignWordListComponent);
  // }

  toggleWordAssignToGroup(wordId: string) {
    // const selectedProduct = this.vocabularyFacade.selectWord(this.selectedWordsForAssignGroups$.getValue(), wordId);
    // this.selectedWordsForAssignGroups$.next(selectedProduct);
    console.log('SELECTED WORDS FOR ASSIGN GROUPS', this.selectedWordsForAssignGroups$.getValue());
  }

  // getWordsFromText() {
  //   this.vocabularyFacade.parseText(this.wordsList.value);

  // }

  shareWordsForAll(words: Word[]) {
    this.store$.dispatch(shareWordToGeneralWordsAction({ words }))

  }

  updateWordsList() {
    this.vocabularyFacade.updateWordsAndGroups();

  }

  showInstallAppSuggestion() {
    const beforeinstallprompt$ = fromEvent(window, 'beforeinstallprompt');
    beforeinstallprompt$
      .pipe(
        delay(4000),
        takeUntil(this.subscription$)
      )
      .subscribe(e => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        // Update UI notify the user they can install the PWA
        if (this.vocabularyFacade.appIsInstalling()) {
          return;
        }

        this.vocabularyFacade.showInstallPromotion(e);
        console.log(e, 'BEFORE INSTALL');
      });
  }

  detectDevice() {
    this.vocabularyFacade.detectDevice();
  }

  // isBaseGroup() {
  //   return (this.getSelectedGroup()._id !== ALL_WORDS_GROUP._id && this.getSelectedGroup()._id !== FAVORITES._id) ? false : true;

  // }

  showUploader() {
    this.isShowUploader = !this.isShowUploader;
  }

  unsubscribe() {
    this.subscription$.next();
    this.subscription$.complete();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

  }
}
