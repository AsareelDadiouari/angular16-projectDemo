import {inject, Injectable, signal} from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  snackBar = inject(MatSnackBar)
  showSpinner = signal(false);
  positionConfig: MatSnackBarConfig ={
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ''
  }

  showSuccessNotification(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close', this.positionConfig);
  }

  showErrorNotification(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Close',  this.positionConfig);
  }

  toggleSpinner(){
    this.showSpinner.update(value => !value);
  }
}
