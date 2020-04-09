import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-edit-word',
  templateUrl: './edit-word.component.html',
  styleUrls: ['./edit-word.component.scss']
})
export class EditWordComponent implements OnInit {

  constructor(protected dialogRef: NbDialogRef<EditWordComponent>) { }

  ngOnInit() {
  
  }

}
