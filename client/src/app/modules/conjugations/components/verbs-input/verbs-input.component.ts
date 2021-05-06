import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-verbs-input',
  templateUrl: './verbs-input.component.html',
  styleUrls: ['./verbs-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerbsInputComponent {
  verbsInput = new FormControl('');

  @Output()
  send = new EventEmitter<string>()

  onSendVerbs(): void {

    if (this.verbsInput.value) {
      this.send.emit(this.verbsInput.value)
    }

  }

}
