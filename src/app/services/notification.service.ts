import {effect, inject, Injectable, signal} from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {LocalizationService} from "./localization.service";
import {toObservable} from "@angular/core/rxjs-interop";
import {translate} from "@angular/localize/tools";
import {take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  snackBar = inject(MatSnackBar)
  spinner = signal(false);
  localizationService = inject(LocalizationService)
  positionConfig: MatSnackBarConfig ={
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ''
  }

  constructor() {
  }

  showSuccessNotification(message: string, duration: number = 3000) {
    this.positionConfig.duration = duration
    this.positionConfig.panelClass = 'success-snackbar'

    this.localizationService.translationService.get(message).pipe(take(1)).subscribe({
      next: translated => this.snackBar.open(translated, 'Close', this.positionConfig),
      error: err => this.snackBar.open(err, 'Close', this.positionConfig),
    })
  }

  showErrorNotification(message: string, duration: number = 3000) {
    this.positionConfig.duration = duration
    this.positionConfig.panelClass = 'failure-snackbar';

    this.localizationService.translationService.get(message).pipe(take(1)).subscribe({
      next: translated => this.snackBar.open(translated, 'Close', this.positionConfig),
      error: err => this.snackBar.open(err, 'Close', this.positionConfig),
    })
  }
}
