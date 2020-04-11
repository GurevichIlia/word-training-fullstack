import { AskQuestionComponent } from './../shared/modals/ask-question/ask-question.component';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';

import { switchMap, takeUntil } from 'rxjs/operators';
import { Observable, EMPTY, Subject } from 'rxjs';
import { Word } from './../shared/interfaces';
import { VocabularyService } from './vocabulary.service';
import { GeneralService } from './../shared/services/general.service';
import { NbMenuService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { NotificationsService } from './../shared/services/notifications.service';


@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss']
})
export class VocabularyComponent implements OnInit, OnDestroy {
  @ViewChild('wordModal') wordModalRef: TemplateRef<any>;
  newWordForm: FormGroup;
  addWordByList: string;
  pageSize = 20;
  filterValue = new FormControl('');
  words$: Observable<Word[]>;
  subscription$ = new Subject();
  titleForWordModal: string;
  wordModal: NbDialogRef<any>;
  editWordOldValue: Word;
  constructor(
    private fb: FormBuilder,
    private generalService: GeneralService,
    private vocabularyService: VocabularyService,
    private router: Router,
    private notification: NotificationsService,
    private menuService: NbMenuService,
    private dialogService: NbDialogService


  ) { }

  ngOnInit() {
    this.getAllWords();
    this.createNewWordForm();
    this.menuService.onItemClick().subscribe(item => console.log(item))
  }


  getAllWords() {
    this.words$ = this.generalService.getCurrentLanguage$()
      .pipe(switchMap(currentLang => {
        if (currentLang) {
          this.generalService.setCurrentLanguage(currentLang);
          return this.vocabularyService.getWordsFromServer(currentLang._id)
            .pipe(switchMap(words => {
              this.generalService.setQuantityWords(words.length)
              this.vocabularyService.setWords(words.reverse());
              return this.vocabularyService.getCurrentWords$();
            }));
        } else {
          this.router.navigate(['languages']);
          return EMPTY;
        }
      }));
  }

  createNewWordForm() {
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
      this.vocabularyService.addWord(this.newWordForm.value)
        .pipe(takeUntil(this.subscription$))
        .subscribe(word => {
          if (word) {
            this.notification.success('', 'Successfully');
            this.vocabularyService.words.getValue().unshift(word);
            this.closeWordModal();
          }
        }, err => this.notification.error('', err.message.error));

    } else {
      this.notification.warning('', 'Please fill in required fields');
    }
  }

  updateWord(oldValue: Word, editeWord: Word) {
    this.vocabularyService.onEdit(editeWord);
    if (editeWord) {
      this.vocabularyService.editWord(editeWord)
        .pipe(takeUntil(this.subscription$))
        .subscribe(editedWord => {
          if (editedWord) {
            this.notification.success('', 'Successfully');
            this.closeWordModal();
          }
        }, err => {
          this.vocabularyService.onEdit(oldValue);
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
      const wordCopy = Object.assign({}, word);
      wordCopy.isFavorite = !wordCopy.isFavorite;
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
      case 'ADD WORD MODAL': this.openWordModal('Add word');
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
    const result$ = this.dialogService.open(AskQuestionComponent, { context: { title }, hasBackdrop: false });

    result$.onClose.pipe(switchMap(res => {
      if (res) {
        this.vocabularyService.deleteWord(word);
        return this.vocabularyService.deleteWordFromServer(word._id);
      } else {
        return EMPTY;
      }
    })).pipe(takeUntil(this.subscription$))
      .subscribe(res => {
        this.notification.success('', `Word ${word.word} removed`);
      }, err => {
        this.notification.error('', err.error.message);
      });

  }

  openWordModal(title: string) {
    this.titleForWordModal = title;
    this.wordModal = this.dialogService.open(this.wordModalRef);
  }

  closeWordModal() {
    if (this.wordModal) {
      this.wordModal.close();
      this.newWordForm.reset();
    }
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
