import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { delay, finalize, shareReplay, takeUntil } from 'rxjs/operators';
import { Action } from 'src/app/core';
import { wordMenuItems } from 'src/app/core/models/vocabulary.model';
import { GroupStatistics } from 'src/app/shared/components/group-statistics/group-statistics.component';
import { Word } from 'src/app/shared/interfaces';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { WordAction } from './../../core/enums/word';
import { WordGroup } from './../../shared/interfaces';
import { AssignWordListComponent } from './assign-word-list/assign-word-list.component';
import { VocabularyFacade } from './vocabulary.facade';




@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss']
})
export class VocabularyComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('wordModal') wordModalRef: TemplateRef<any>;
  selectedGroup$: Observable<WordGroup> = this.vocabularyFacade.getSelectedGroup$().pipe(shareReplay());
  newWordForm: FormGroup;
  addWordByList: string;
  pageSize = 20;
  filterControl = new FormControl('');
  subscription$ = new Subject();
  titleForModal: string;
  wordModal: NbDialogRef<any>;
  editWordOldValue: Word;
  wordMenuItems = wordMenuItems;
  allWords$: Observable<Word[]>;
  wordsFiltredByGroup$: Observable<Word[]>;

  selectedWordsForAssignGroups$ = new BehaviorSubject<string[]>([]);
  loader = false;

  //
  isLoading = false;
  statistics$: Observable<GroupStatistics>;
  isShowUploader = false;

  userWords$: Observable<Word[]>;
  groups$: Observable<WordGroup[]>;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NotificationsService,
    private dialogService: NbDialogService,
    private vocabularyFacade: VocabularyFacade,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.allWords$ = this.vocabularyFacade.getAllUserWords$();


    this.wordFormInitial();
    this.getWordsFilteredByGroup();
    // this.getUserGroups()
    // this.getWordsGroups();

    // this.vocabularyFacade.isUpdateGroups()
    //   .pipe(takeUntil(this.subscription$))
    //   .subscribe(() => this.getWordsGroups());

    this.showInstallAppSuggestion();

    this.detectDevice();
  }

  ngAfterViewInit() {

  }

  getGroupStatistics() {
    this.statistics$ = this.vocabularyFacade.getGroupStatistics(this.wordsFiltredByGroup$);
  }
  // getAllWords() {
  //   this.allWords$ = this.vocabularyFacade.getAllUserWords$()
  //     .pipe(
  //       shareReplay()
  //     );
  // }

  getWordsFilteredByGroup(): void {
    this.wordsFiltredByGroup$ = (this.vocabularyFacade.getUserWordsFiltredByGroup(this.filterControl.valueChanges) as Observable<Word[]>)
      .pipe(
        shareReplay()
      );

    this.getGroupStatistics();
  }

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
    this.newWordForm = this.fb.group({
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
    if (this.newWordForm.valid) {
      this.isLoading = true;
      this.vocabularyFacade.addNewWord(this.newWordForm.value, this.vocabularyFacade.getSelectedGroup()._id)
        .pipe(
          finalize(() => this.isLoading = false),
          takeUntil(this.subscription$)
        )
        .subscribe(word => {
          if (word) {
            this.notification.success('', 'Word added');
            this.closeWordModal();
            this.vocabularyFacade.updateWordsAndGroups();
            // this.getWordsGroups();

          }
        }, err => this.notification.error('', err.message.error));

    } else {
      this.notification.warning('', 'Please fill in required fields');
    }
  }

  updateWord(oldValue: Word, editeWord: Word) {
    // this.vocabularyFacade.onEdit(editeWord);
    if (editeWord) {
      this.isLoading = true;
      this.vocabularyFacade.updateWord(editeWord);
      this.vocabularyFacade.editWord(editeWord)
        .pipe(
          finalize(() => this.isLoading = false),
          takeUntil(this.subscription$)
        )
        .subscribe(editedWord => {
          if (editedWord) {
            this.closeWordModal();
            // this.vocabularyFacade.updateWordsAndGroups();
          }
        }, err => {
          // this.vocabularyFacade.onEdit(oldValue);
          this.notification.error('', err.message.error);
        });
    }
  }

  openEditModal(word: Word) {
    this.editWordOldValue = Object.assign({}, word);
    this.newWordForm.patchValue({
      word: word.word,
      translation: word.translation,
      _id: word._id,
      isFavorite: word.isFavorite
    });
    this.openWordModal('Edit word');
  }

  setFavorite(word: Word) {
    if (word) {
      const wordCopy = { ...word, isFavorite: !word.isFavorite };
      this.updateWord(word, wordCopy);
    }

  }

  trackWords(index, word: Word) {
    if (!word) {
      return null;
    } else {
      return word._id;
    }
  }

  getActionFromChildren(event: Action<Word>) {
    switch (event.action) {
      case WordAction.SHARE_FOR_ALL: this.shareWordsForAll([event.payload]);
        break
      case WordAction.TO_FAVORITE: this.setFavorite(event.payload);
        break
      case WordAction.DELETE_WORD: this.deleteWord(event.payload);
        break;
      case WordAction.EDIT_WORD: this.openEditModal(event.payload);
        break;
      default:
        break;
    }
  }


  deleteWord(word: Word) {
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
    this.vocabularyFacade.deleteWordFromServer(word)
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(res => {
        // this.notification.success('', `Word ${word.word} removed`);
        this.notification.success('Removed');
        this.vocabularyFacade.updateWordsAndGroups();
        // this.getWords();
      }, err => {
        this.notification.error('', err.error.message);
      });

  }

  openWordModal(title: string) {
    this.titleForModal = title;
    this.wordModal = this.dialogService.open(this.wordModalRef);
  }

  closeWordModal() {
    if (this.wordModal) {
      this.wordModal.close();
      this.newWordForm.reset();
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

  showWordsForAssign() {
    // tslint:disable-next-line: max-line-length
    this.dialogService.open(AssignWordListComponent, { context: { words$: this.allWords$, group: this.vocabularyFacade.getSelectedGroup()._id } });
  }

  toggleWordAssignToGroup(wordId: string) {
    // const selectedProduct = this.vocabularyFacade.selectWord(this.selectedWordsForAssignGroups$.getValue(), wordId);

    // this.selectedWordsForAssignGroups$.next(selectedProduct);
    console.log('SELECTED WORDS FOR ASSIGN GROUPS', this.selectedWordsForAssignGroups$.getValue());
  }

  // getWordsFromText() {
  //   this.vocabularyFacade.parseText(this.wordsList.value);

  // }

  shareWordsForAll(word: Word[]) {
    this.vocabularyFacade.addWordsToGeneralList(word)
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe();
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
