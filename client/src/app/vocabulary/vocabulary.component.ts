import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Word, WordGroup } from './../shared/interfaces';
import { AskQuestionComponent } from './../shared/modals/ask-question/ask-question.component';
import { NotificationsService } from './../shared/services/notifications.service';
import { ALL_WORDS, VocabularyFacade } from './vocabulary.facade';



@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss']
})
export class VocabularyComponent implements OnInit, OnDestroy {
  @ViewChild('wordModal') wordModalRef: TemplateRef<any>;
  @ViewChild('groupModalRef') groupModalRef: TemplateRef<any>;

  newWordForm: FormGroup;
  addWordByList: string;
  pageSize = 20;
  filterValue = new FormControl('');
  subscription$ = new Subject();
  titleForModal: string;
  wordModal: NbDialogRef<any>;
  editWordOldValue: Word;

  // allWords$: Observable<Word[]>;
  wordsFiltredByGroup$: Observable<Word[]>;
  wordGroups$: Observable<WordGroup[]>;
  selectedGroup$ = new BehaviorSubject<string>(ALL_WORDS);
  groupName = new FormControl('', Validators.required);
  groupModal: NbDialogRef<any>;

  selectedWordsForAssignGroups$ = new BehaviorSubject<string[]>([]);
  loader = false;
  wordsList = this.fb.control('');
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notification: NotificationsService,
    private dialogService: NbDialogService,
    private vocabularyFacade: VocabularyFacade
  ) { }

  ngOnInit() {
    this.wordFormInitial();

    this.getWordsFilteredByGroup();

    this.getWordsGroups();

    // this.wordsList.valueChanges.subscribe(value => this.getWordsFromText());
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
      this.filterValue.valueChanges
    );
  }

  getWordsGroups() {

    this.wordGroups$ = this.vocabularyFacade.getWordsGroups$();

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
            this.notification.success('', 'Successfully');
            this.closeWordModal();
            this.vocabularyFacade.updateWordList();
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
            // this.vocabularyFacade.updateWordList();
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
    // tslint:disable-next-line: max-line-length
    const title = `Would you like to remove word ${word.word} ?`;
    const result$ = this.dialogService.open(AskQuestionComponent, { context: { title }, hasBackdrop: true });

    result$.onClose.pipe(switchMap(res => {
      if (res) {
        // this.vocabularyFacade.deleteWord(word);
        return this.vocabularyFacade.deleteWordFromServer(word._id);
      } else {
        return EMPTY;
      }
    })).pipe(
      takeUntil(this.subscription$)
    )
      .subscribe(res => {
        this.notification.success('', `Word ${word.word} removed`);
        this.vocabularyFacade.updateWordList();
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
      .subscribe(res => {
        this.groupModal.close();
        // this.getGroups();
        console.log('RES AFTER SAVE GROUP', res);
      })
  }

  assignGroup() {

  }

  openGroupModal(title: string) {
    this.titleForModal = title;
    this.groupModal = this.dialogService.open(this.groupModalRef);
  }

  toggleShowWordsForAssign(test) {

  }

  toggleWordAssignToGroup(wordId: string) {
    // const selectedProduct = this.vocabularyFacade.selectWord(this.selectedWordsForAssignGroups$.getValue(), wordId);

    // this.selectedWordsForAssignGroups$.next(selectedProduct);
    console.log('SELECTED WORDS FOR ASSIGN GROUPS', this.selectedWordsForAssignGroups$.getValue());
  }

  getWordsFromText() {
    this.vocabularyFacade.parseText(this.wordsList.value);

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
