import {effect, inject, Injectable, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { parseString } from 'xml2js';
import {TranslateService} from "@ngx-translate/core";
import {toSignal} from "@angular/core/rxjs-interop";

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
  translatedMessage = signal<string | undefined>(undefined);
  translatedMessageSignal = signal<string | undefined>(undefined);

  constructor() {
    effect(() => {
      if (this.translatedMessage()){
        this.translationService.get(this.translatedMessage() as string).subscribe(value => {
          this.translatedMessageSignal.set(value);
        })
      }
    },  { allowSignalWrites: true })

    this.translationService.setDefaultLang(this.localesList[0].code);
    this.translationService.use(this.localesList[1].code);
  }

  setLanguage(language: string): void {
    this.currentLanguage.set(language);
    this.translationService.use(language);
  }
}
