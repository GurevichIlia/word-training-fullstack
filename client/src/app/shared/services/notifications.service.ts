import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private snackBar: MatSnackBar
  ) { }

  success(message: string, title?: string) {
    // this.toastr.success(message, title);
    let text = ''
    if (message) {
      text = message;
    } else {
      text = title;
    }
    this.snackBar.open(text, '', {
      duration: 1500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  warning(message: string, title?: string) {
    // this.toastr.warning(message, title);
    let text = ''
    if (message) {
      text = message;
    } else {
      text = title;
    }
    this.snackBar.open(text, '', {
      duration: 1500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  error(message: string, title?: string) {
    // this.toastr.danger(message, title);
    let text = ''
    if (message) {
      text = message;
    } else {
      text = title;
    }
    this.snackBar.open(text, '', {
      duration: 1500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  info(message: string, title?: string) {
    // this.toastr.info(message, title);
    let text = ''
    if (message) {
      text = message;
    } else {
      text = title;
    }
    this.snackBar.open(text, '', {
      duration: 1500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
