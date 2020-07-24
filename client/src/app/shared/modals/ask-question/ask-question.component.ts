import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent {
  @Input() title: string;
  constructor(
    protected dialogRef: NbDialogRef<AskQuestionComponent>) {

  }


  close(answer: boolean) {
    this.dialogRef.close(answer);

  }


}
