import {effect, inject, Injectable, signal} from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {LocalizationService} from "./localization.service";
import {toObservable} from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  snackBar = inject(MatSnackBar)
  showSpinner = signal(false);
  localizationService = inject(LocalizationService)
    positionConfig: MatSnackBarConfig ={
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ''
  }

  constructor() {
    effect(() => {
      const translated = this.localizationService.translatedMessageSignal();

      if (translated)
        this.snackBar.open(translated, 'Close', this.positionConfig);
    })
  }

  showSuccessNotification(message: string, duration: number = 3000) {
      this.localizationService.translatedMessage.set(message);
  }

  showErrorNotification(message: string, duration: number = 3000) {
    this.localizationService.translatedMessage.set(message);
  }

  toggleSpinner(){
    this.showSpinner.update(value => !value);
  }
}
