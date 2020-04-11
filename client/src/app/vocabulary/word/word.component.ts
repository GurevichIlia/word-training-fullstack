
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Word } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordComponent implements OnInit, OnChanges {
  @Input() word: Word;
  @Output() action = new EventEmitter();
  items = [{ title: 'Edit' }, { title: 'Delete' }];

  constructor(
    // private change: ChangeDetectorRef
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    // console.log('WORD CHANGE DETECTION', this.word);
  }
  // ngDoCheck() {
  //   console.log('WORD CHANGE DETECTION');
  //   // this.change.markForCheck();
  // }

  ngOnInit() {
    // this.createEditFormForWord();
  }

  dispatchAction(action: string, payload: any) {
    this.action.emit({ action, payload });
  }
  // createEditFormForWord() {
  //   this.editForm = new FormGroup({
  //     id: new FormControl(this.word.id),
  //     word: new FormControl(this.word.word, Validators.required),
  //     translate: new FormControl(this.word.translate, Validators.required),
  //     favorite: new FormControl(this.word.favorite)
  //   });
  // }
  // onFavorite(favorite: boolean) {
  //   this.editForm.get('favorite').patchValue(favorite);
  //   this.onSaveEditedWord();
  // }
  // onEdit() {
  //   this.edit = true;
  // }
  // removeWord() {
  //   this.removedWord.emit(this.word);
  // }
  // onSaveEditedWord() {
  //   this.editedWord.emit(this.editForm.value);
  //   this.edit = false;
  // }
}
