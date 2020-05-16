import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private toastr: NbToastrService,
  ) { }

  success(message: string, title?: string) {
    this.toastr.success(message, title);
  }

  warning(message: string, title?: string) {
    this.toastr.warning(message, title);
  }

  error(message: string, title?: string) {
    this.toastr.danger(message, title);
  }

  info(message: string, title?: string) {
    this.toastr.info(message, title);
  }
}
