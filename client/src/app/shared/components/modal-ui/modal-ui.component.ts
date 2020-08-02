import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-ui',
  templateUrl: './modal-ui.component.html',
  styleUrls: ['./modal-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalUiComponent implements OnInit {
  @Input() title: string = '';
  @Input() isLoading: boolean = false;
  @Output() cancel = new EventEmitter();
  @Output() update = new EventEmitter();
  @Output() save = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  actionHandler(action: string) {
    switch (action) {
      case 'save':
        this.save.emit();
        break;
      case 'update':
        this.update.emit();
        break;
      case 'cancel':
        this.cancel.emit();
        break;
      default:
        break;
    }
  }
  isNewMode() {
    if (this.title) {
      return this.title.includes('New');

    }

    return true;
  }
}
