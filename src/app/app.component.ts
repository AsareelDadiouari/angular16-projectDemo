import {Component, effect, inject, OnInit, signal} from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en'; // Import locale data for English
registerLocaleData(localeEn, 'en');

@Component({
  selector: 'app-root',
  template: `
    <mat-drawer-container class="example-container" autosize>
      <mat-drawer #drawer class="example-sidenav" mode="side">
        <mat-list role="list">
          <mat-list-item class="mat-list-item" i18n routerLink="/" role="listitem">Home</mat-list-item>
          <mat-list-item class="mat-list-item" i18n role="listitem">List of trainee evaluations</mat-list-item>
        </mat-list>
      </mat-drawer>

      <app-header [drawer]="drawer"></app-header>

      <!-- Main content -->
      <div class="content" role="main">
        <div *ngIf="loading" class="spinner-overlay">
          <mat-progress-spinner color="primary" mode="indeterminate"></mat-progress-spinner>
        </div>
        <router-outlet></router-outlet>
      </div>
    </mat-drawer-container>
  `,
  styleUrls: ['./app.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }]
})
export class AppComponent implements OnInit{
  localesList = [
    { code: 'en-US', label: 'English' },
    { code: 'fr', label: 'Français' }
  ];
  loading = false;
  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
