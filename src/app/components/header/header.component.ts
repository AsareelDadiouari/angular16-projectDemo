import {Component, computed, effect, inject, Input, OnInit} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {MatButtonToggleChange} from "@angular/material/button-toggle";
import {LocalizationService} from "../../services/localization.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationDialogComponent} from "../dialogs/authentication-dialog.component";
import {Router} from "@angular/router";
import {BackendService} from "../../services/backend.service";
import {Professor} from "../../models/professor.model";
import {Headmaster} from "../../models/headmaster.model";
import {Supervisor} from "../../models/supervisor.model";

@Component({
  selector: 'app-header',
  template: `
    <!-- Toolbar -->
    <div class="toolbar" role="banner">
      <button (click)="_drawer.toggle()" mat-icon-button type="button">
        <mat-icon *ngIf="!_drawer.opened;">chevron_right</mat-icon>
        <mat-icon *ngIf="_drawer.opened">chevron_left</mat-icon>
      </button>
      <img
        width="40"
        alt="Angular Logo"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="
      />
      <span i18n="Web app Name">Assessement Tool</span>
      <button routerLink="/evaluation" style="margin-left: 15px" i18n color="primary" mat-raised-button>File an evaluation</button>
      <button *ngIf="this.backendService.authenticated().state" routerLink="/codeGen" style="margin-left: 15px" color="primary" mat-raised-button>Generate a code for a student</button>

      <div class="spacer"></div>

      <button *ngIf="!this.backendService.authenticated().state; else Name" type="button" mat-stroked-button
              color="white" (click)="handleAuthButton()" class="auth-button">Authentication
      </button>
      <ng-template style="margin-right: 100px" #Name>Bonjour {{_name}}</ng-template>

      <button *ngIf="this.backendService.authenticated().state"
              (click)="backendService.logout()"
              type="button"
              mat-stroked-button
              class="auth-button"
              color="white"
      >Logout</button>

      <mat-button-toggle-group (change)="switchLanguage($event)" name="fontStyle" aria-label="Font Style">
        <mat-button-toggle value="fr">FR</mat-button-toggle>
        <mat-button-toggle value="en">EN</mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `,
  styles: [`
    .toolbar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      display: flex;
      align-items: center;
      background-color: #1976d2;
      color: white;
      font-weight: 600;
    }

    .toolbar img {
      margin: 0 16px;
    }

    .toolbar #twitter-logo {
      height: 40px;
      margin: 0 8px;
    }

    .toolbar #youtube-logo {
      height: 40px;
      margin: 0 16px;
    }

    .toolbar #twitter-logo:hover,
    .toolbar #youtube-logo:hover {
      opacity: 0.8;
    }

    .spacer {
      flex: 1;
    }

    .auth-button {
      background-color: #24292e;
      margin-left: 10px;
      margin-right: 10px;
    }

    .auth-button:hover {

      background-color: #2949b0;
      color: white;
    }
  `]
})
export class HeaderComponent implements OnInit{
  @Input()
  set drawer(matDrawer: MatDrawer) {
    this._drawer = matDrawer;
    setTimeout(() => this._drawer.toggle(), 2000);
  }

  protected _drawer!: MatDrawer;
  localizationService = inject(LocalizationService);
  backendService = inject(BackendService)
  dialog = inject(MatDialog);
  router = inject(Router);
  _name! : string
  userInfo = this.backendService.getAuthenticatedUser()

  constructor() {
    effect(() => {
      this._name = this.userInfo().value?.firstname + " " + this.userInfo().value?.lastname?.toUpperCase()
    })
  }

  ngOnInit() {
    console.log(this.backendService.authenticated().state)
  }

  switchLanguage(buttonToggle : MatButtonToggleChange): void {
    const currentLanguage = this.localizationService.getLanguage();
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    this.localizationService.setLanguage(newLanguage);
  }

  handleAuthButton(){
    const dialogRef = this.dialog.open(AuthenticationDialogComponent, {
      //height: '40%',
      width: '300px'
    });
    if (dialogRef === null)
      this.router.navigate(['/auth']).then(() => alert("Failed to open dialog"))
  }

  protected readonly localStorage = localStorage;
}
