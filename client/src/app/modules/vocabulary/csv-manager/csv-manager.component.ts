import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Word, WordGroup } from 'src/app/shared/interfaces';
import { addWordsFromCsvAction } from 'src/app/store/actions/vocabulary.actions';
import { csvLoaderSelector, isCloseCsvHandlerSelector, isResetCsvHandlerSelector } from 'src/app/store/selectors/vocabulary.selectors';
import { AppStateInterface } from './../../../store/reducers';

@Component({
  selector: 'app-csv-manager',
  templateUrl: './csv-manager.component.html',
  styleUrls: ['./csv-manager.component.scss'],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class CsvManagerComponent implements OnInit {
  @ViewChild('instruction') insctructionModal: TemplateRef<any>;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  _expanded: boolean;
  @Input() set expanded(isExpanded: boolean) {
    this._expanded = isExpanded
    if (isExpanded === false) {
      this.resetState();
    }
  };
  @Input() selectedGroup: WordGroup;

  file = new EventEmitter<File>();
  isLoading$: Observable<boolean>;
  isCloseCsvHandler$: Observable<boolean>
  isResetCsvHandlerState$: Observable<boolean>
  words$: Observable<Word[]>;
  selectedFile: File;
  constructor(
    private dialog: NbDialogService,
    private store$: Store<AppStateInterface>
  ) { }

  ngOnInit() {
    this.isLoading$ = this.store$.pipe(select(csvLoaderSelector));
    this.isCloseCsvHandler$ = this.store$.pipe(
      select(isCloseCsvHandlerSelector),
    )

    this.isResetCsvHandlerState$ = this.store$.pipe(
      select(isResetCsvHandlerSelector),
      tap((isReset: boolean) => isReset ? this.resetState() : null)
    )
  }

  onUpload(file: File) {
    this.store$.dispatch(addWordsFromCsvAction({ file, selectedGroupId: this.selectedGroup._id }))
  }

  showFile(file: File) {
    if (!file) return
    this.selectedFile = file;
  }

  showInstruction() {
    this.dialog.open(this.insctructionModal)
  }

  resetState() {
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';

    }
  }
}
