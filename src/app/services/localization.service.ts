import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { parseString } from 'xml2js';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private currentLanguage = 'fr'; // Default language
  private translations: any; // Object to store the loaded translation files
  translationService = inject(TranslateService);
  localesList = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
  ];

  constructor(private http: HttpClient) {
    this.translationService.setDefaultLang(this.localesList[0].code);
    this.translationService.use(this.localesList[1].code);
  }

  public setLanguage(language: string): void {
    /*if (language !== this.currentLanguage) {
      this.currentLanguage = language;
      this.loadTranslationFile(language);
    }*/
    this.currentLanguage = language;
    this.translationService.use(language);
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  public getTranslation(key: string): string {
    if (this.translations && this.translations[this.currentLanguage]) {
      return this.translations[this.currentLanguage][key] || key;
    }
    return key;
  }

private loadTranslationFile(language: string): void {
  const translationFileUrl = `assets/locale/messages.${language}.xlf`; // Update the file extension
  this.http.get(translationFileUrl, { responseType: 'text' }).subscribe(
    (xmlData) => {
      parseString(xmlData, { explicitArray: false }, (err, result) => {
        if (err) {
          console.error(`Failed to parse translation file for ${language}`);
          return;
        }
        const transUnits = result?.xliff?.file?.body?.['trans-unit'];
        if (Array.isArray(transUnits)) {
          const translations: { [key: string]: string } = {}; // Type assertion
          for (const transUnit of transUnits) {
            const id = transUnit?.$?.id;
            const target = transUnit?.target?.[0];
            if (id && target) {
              translations[id] = target;
            }
          }
          this.translations = {
            ...this.translations,
            [language]: translations
          };
        } else {
          console.error(`Invalid translation file structure for ${language}`);
        }
      });
    },
    (error) => {
      console.error(`Failed to load translation file for ${language}`);
    }
  );
  }
}
