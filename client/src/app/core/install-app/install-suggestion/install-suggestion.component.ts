import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstallAppService } from '../install-app.service';

@Component({
  selector: 'app-install-suggestion',
  templateUrl: './install-suggestion.component.html',
  styleUrls: ['./install-suggestion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstallSuggestionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<InstallSuggestionComponent>,

    public installApp: InstallAppService,
  ) { }

  ngOnInit() {

  }
  onInstallApp() {
    this.installApp.installApp();
    this.dialogRef.close();
  }


}
