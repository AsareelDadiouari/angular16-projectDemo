import {effect, inject, Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, switchMap, tap, throwError} from 'rxjs';
import { parseString } from 'xml2js';
import {TranslateService} from "@ngx-translate/core";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  public currentLanguage = signal('fr'); // Default language
  localesList = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
  ];
  translationService = inject(TranslateService);

  constructor() {
    this.translationService.setDefaultLang(this.localesList[0].code);
    this.translationService.use(this.localesList[1].code);
  }

  setLanguage(language: string): void {
    this.currentLanguage.set(language);
    this.translationService.use(language);
  }
}
