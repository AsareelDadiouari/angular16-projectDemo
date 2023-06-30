import {inject, Injectable} from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  snackBar = inject(MatSnackBar)

  showSuccessNotification(message: string, duration: number = 3000) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: 'success-notification' // Custom CSS class for success notification
    };

    this.snackBar.open(message, 'Close', config);
  }

  showErrorNotification(message: string, duration: number = 3000) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: 'error-notification' // Custom CSS class for error notification
    };

    this.snackBar.open(message, 'Close', config);
  }
}
