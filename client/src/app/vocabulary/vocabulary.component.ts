import { AssignWordListComponent } from './assign-word-list/assign-word-list.component';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbCardBackComponent, NbCardBodyComponent } from '@nebular/theme';
import { BehaviorSubject, EMPTY, Observable, Subject, fromEvent } from 'rxjs';
import { switchMap, takeUntil, filter, tap, take, delay } from 'rxjs/operators';
import { Word, WordGroup, MenuItem } from './../shared/interfaces';
import { AskQuestionComponent } from './../shared/modals/ask-question/ask-question.component';
import { NotificationsService } from './../shared/services/notifications.service';
import { ALL_WORDS, VocabularyFacade } from './vocabulary.facade';
import { InstallSuggestionComponent } from '../core/install-app/install-suggestion/install-suggestion.component';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';



@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss']
})
export class VocabularyComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('wordModal') wordModalRef: TemplateRef<any>;
  @ViewChild('groupModalRef') groupModalRef: TemplateRef<any>;

  newWordForm: FormGroup;
  addWordByList: string;
  pageSize = 20;
  filterControl = new FormControl('');
  subscription$ = new Subject();
  titleForModal: string;
  wordModal: NbDialogRef<any>;
  editWordOldValue: Word;

  allWords$: Observable<Word[]>;
  wordsFiltredByGroup$: Observable<Word[]>;
  wordGroups$: Observable<WordGroup[]>;
  selectedGroup$ = new BehaviorSubject<string>(ALL_WORDS);
  groupName = new FormControl('', Validators.required);
  groupModal: NbDialogRef<any>;

  selectedWordsForAssignGroups$ = new BehaviorSubject<string[]>([]);
  loader = false;
  wordsList = this.fb.control('');

  wordMenuItems = [
    new MenuItem('Edit', 'EDIT WORD', 'edit-2-outline'),
    new MenuItem('Share for all', 'SHARE FOR ALL', 'share'),
    new MenuItem('Delete', 'DELETE WORD', 'trash-2-outline'),
  ];

  deferredPrompt // For 'beforeinstallprompt' event
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
    this.getWordsGroups();

    this.vocabularyFacade.isUpdateGroups()
      .pipe(takeUntil(this.subscription$))
      .subscribe(() => this.getWordsGroups());

    this.showInstallAppSuggestion();

    this.detectDevice();
  }

  ngAfterViewInit() {

  }


  // getAllWords() {
  //   this.allWords$ = this.vocabularyFacade.getAllUserWords$()
  //     .pipe(
  //       shareReplay()
  //     );
  // }

  getWordsFilteredByGroup() {
    this.wordsFiltredByGroup$ = this.vocabularyFacade.getUserWordsFiltredByGroup(
      this.selectedGroup$.asObservable(),
      this.filterControl.valueChanges
    ) as Observable<Word[]>;
  }

  // getUserGroups() {
  //   this.vocabularyFacade.getWordsGroups()
  //     .pipe(
  //       take(1),
  //       takeUntil(this.subscription$)

  //     ).subscribe(() => console.log('USER GROUPS GOT'));
  // }

  getWordsGroups() {

    this.wordGroups$ = this.vocabularyFacade.getWordsGroups();

  }

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
      this.vocabularyFacade.addNewWord(this.newWordForm.value)
        .pipe(
          takeUntil(this.subscription$)
        )
        .subscribe(word => {
          if (word) {
            this.notification.success('', 'Word added');
            this.closeWordModal();
            this.vocabularyFacade.updateWordsAndGroups();
            this.getWordsGroups();

          }
        }, err => this.notification.error('', err.message.error));

    } else {
      this.notification.warning('', 'Please fill in required fields');
    }
  }

  updateWord(oldValue: Word, editeWord: Word) {
    // this.vocabularyFacade.onEdit(editeWord);
    if (editeWord) {
      this.vocabularyFacade.updateWord(editeWord);
      this.vocabularyFacade.editWord(editeWord)
        .pipe(
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

  getActionFromChildren(event: { action: string, payload?: Word }) {
    switch (event.action) {
      case 'SHARE FOR ALL': this.shareWordsForAll([event.payload]);
        break
      case 'IS FAVORITE': this.setFavorite(event.payload);
        break
      case 'DELETE WORD': this.deleteWord(event.payload);
        break;
      case 'EDIT WORD': this.openEditModal(event.payload);
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

  createNewGroup() {
    if (!this.groupName.valid) {
      return this.notification.warning('', 'Please fill in required fields');

    }

    this.vocabularyFacade.createWordGroup(this.groupName.value)
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(group => {
        this.vocabularyFacade.updateWordsAndGroups();
        this.groupName.patchValue('');
        this.groupModal.close();
        this.selectedGroup$.next(group._id);

        // this.getGroups();
        console.log('RES AFTER SAVE GROUP', group);
      })
  }

  deleteWordGroup(groupId: string, groups: WordGroup[]) {

    this.vocabularyFacade.deleteWordGroup(groupId, groups)
      .pipe(takeUntil(this.subscription$))
      .subscribe(res => {
        this.vocabularyFacade.updateWordsAndGroups();
        this.selectedGroup$.next('1');
        // this.getGroups();
        console.log('RES AFTER DELETE GROUP', res);
      })
  }

  assignGroup() {

  }

  openGroupModal(title: string) {
    this.titleForModal = title;
    this.groupModal = this.dialogService.open(this.groupModalRef);
  }

  showWordsForAssign() {
    this.dialogService.open(AssignWordListComponent, { context: { words$: this.allWords$, group: this.selectedGroup$.getValue() } });
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
