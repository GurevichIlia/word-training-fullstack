"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ask_question_component_1 = require("./../shared/modals/ask-question/ask-question.component");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
let VocabularyComponent = class VocabularyComponent {
    constructor(fb, generalService, vocabularyService, router, notification, menuService, dialogService) {
        this.fb = fb;
        this.generalService = generalService;
        this.vocabularyService = vocabularyService;
        this.router = router;
        this.notification = notification;
        this.menuService = menuService;
        this.dialogService = dialogService;
        this.pageSize = 20;
        this.filterValue = new forms_1.FormControl('');
        this.subscription$ = new rxjs_1.Subject();
    }
    ngOnInit() {
        this.getAllWords();
        this.createNewWordForm();
        this.menuService.onItemClick().subscribe(item => console.log(item));
    }
    getAllWords() {
        this.words$ = this.generalService.getCurrentLanguage$()
            .pipe(operators_1.switchMap(currentLang => {
            if (currentLang) {
                this.generalService.setCurrentLanguage(currentLang);
                return this.vocabularyService.getWordsFromServer(currentLang._id)
                    .pipe(operators_1.switchMap(words => {
                    this.generalService.setQuantityWords(words.length);
                    this.vocabularyService.setWords(words.reverse());
                    return this.vocabularyService.getCurrentWords$();
                }));
            }
            else {
                this.router.navigate(['languages']);
                return rxjs_1.EMPTY;
            }
        }));
    }
    createNewWordForm() {
        this.newWordForm = this.fb.group({
            word: ['', forms_1.Validators.required],
            translation: ['', forms_1.Validators.required],
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
                .pipe(operators_1.takeUntil(this.subscription$))
                .subscribe(word => {
                if (word) {
                    this.notification.success('', 'Successfully');
                    this.vocabularyService.words.getValue().unshift(word);
                    this.closeWordModal();
                }
            }, err => this.notification.error('', err.message.error));
        }
        else {
            this.notification.warning('', 'Please fill in required fields');
        }
    }
    updateWord(oldValue, editeWord) {
        this.vocabularyService.onEdit(editeWord);
        if (editeWord) {
            this.vocabularyService.editWord(editeWord)
                .pipe(operators_1.takeUntil(this.subscription$))
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
    openEditModal(word) {
        this.editWordOldValue = Object.assign({}, word);
        this.newWordForm.patchValue({
            word: word.word,
            translation: word.translation,
            _id: word._id,
            isFavorite: word.isFavorite
        });
        this.openWordModal('Edit word');
    }
    setFavorite(word) {
        if (word) {
            const wordCopy = Object.assign({}, word);
            wordCopy.isFavorite = !wordCopy.isFavorite;
            this.updateWord(word, wordCopy);
        }
    }
    trackWords(index, word) {
        if (!word) {
            return null;
        }
        else {
            return word._id;
        }
    }
    getActionFromChildren(event) {
        switch (event.action) {
            case 'IS FAVORITE':
                this.setFavorite(event.payload);
                break;
            case 'ADD WORD MODAL':
                this.openWordModal('Add word');
                break;
            case 'DELETE WORD':
                this.deleteWord(event.payload);
                break;
            case 'EDIT WORD':
                this.openEditModal(event.payload);
                break;
            default:
                break;
        }
    }
    deleteWord(word) {
        // tslint:disable-next-line: max-line-length
        const title = `Would you like to remove word ${word.word} ?`;
        const result$ = this.dialogService.open(ask_question_component_1.AskQuestionComponent, { context: { title }, hasBackdrop: false });
        result$.onClose.pipe(operators_1.switchMap(res => {
            if (res) {
                this.vocabularyService.deleteWord(word);
                return this.vocabularyService.deleteWordFromServer(word._id);
            }
            else {
                return rxjs_1.EMPTY;
            }
        })).pipe(operators_1.takeUntil(this.subscription$))
            .subscribe(res => {
            this.notification.success('', `Word ${word.word} removed`);
        }, err => {
            this.notification.error('', err.error.message);
        });
    }
    openWordModal(title) {
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
    ngOnDestroy() {
        this.unsubscribe();
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
    }
};
__decorate([
    core_1.ViewChild('wordModal')
], VocabularyComponent.prototype, "wordModalRef", void 0);
VocabularyComponent = __decorate([
    core_1.Component({
        selector: 'app-vocabulary',
        templateUrl: './vocabulary.component.html',
        styleUrls: ['./vocabulary.component.scss']
    })
], VocabularyComponent);
exports.VocabularyComponent = VocabularyComponent;
//# sourceMappingURL=vocabulary.component.js.map