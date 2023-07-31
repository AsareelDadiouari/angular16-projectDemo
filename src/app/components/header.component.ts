import {Component, computed, DestroyRef, effect, inject, Input, OnInit} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {MatButtonToggleChange} from "@angular/material/button-toggle";
import {LocalizationService} from "../services/localization.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationDialogComponent} from "./dialogs/authentication-dialog.component";
import {Router} from "@angular/router";
import {BackendService} from "../services/backend.service";
import {Professor} from "../models/entities/professor.model";
import {Headmaster} from "../models/entities/headmaster.model";
import {Supervisor} from "../models/entities/supervisor.model";
import {NotificationService} from "../services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-header',
  template: `
    <header>
      <!-- Toolbar -->
      <mat-toolbar class="toolbar" color="primary">
        <button [hidden]="true" mat-icon-button (click)="_drawer.toggle()" type="button">
          <mat-icon *ngIf="!_drawer.opened">chevron_right</mat-icon>
          <mat-icon *ngIf="_drawer.opened">chevron_left</mat-icon>
        </button>
        <a routerLink="/" style="margin-top: 10px; margin-right: 19px"> <img width="120" alt="Angular Logo" src="https://upload.wikimedia.org/wikipedia/fr/3/34/UQAC_Logo.png?20110307173130" /></a>
          <mat-icon [ngStyle]="{ 'margin-right': '25px', 'font-size.px': '60px' }" routerLink="/">home</mat-icon>
        <span >{{'Assessment Tool' | translate }}</span>
        <button
          routerLink="/evaluation"
          style="margin-left: 15px"
          mat-button
        >
            {{'File an evaluation' | translate}}
        </button>
        <button
          *ngIf="this.backendService.authenticated().state;"
          routerLink="/codeGen"
          style="margin-left: 15px"
          mat-button
        >
            {{'Generate a code for a student' | translate}}
        </button>

        <div class="spacer"></div>

          <mat-icon [matTooltip]="localizationService.currentLanguage() === 'fr' ? 'Connexion' : 'Authentication'" style="font-size: 24px; margin-right: 25px" (click)="handleAuthButton()" *ngIf="!this.backendService.authenticated().state" class="text-3xl">person</mat-icon>

          <button *ngIf="backendService.authenticated().state" mat-button style="margin-right: 10px" [matMenuTriggerFor]="userMenu" #Name>
              <mat-icon style="margin-right: 15px">person</mat-icon>
              <span style="margin-right: 1px; margin-top: 25px">{{ _name }}</span>
          </button>

          <mat-menu #userMenu="matMenu">
              <button
                      *ngIf="this.backendService.authenticated().state"
                      (click)="logout()"
                      type="button"
                      mat-menu-item
                      class="logout-button"
              >
                  {{'Logout' | translate}}
              </button>
          </mat-menu>


          <span style="margin-right: 10px" class="mx-2">|</span>
          <a [matMenuTriggerFor]="menuLanguage" class="mat-title m-0 cursor-pointer">{{localizationService.currentLanguage().toUpperCase() }}</a>
          <mat-menu #menuLanguage="matMenu">
              <button mat-menu-item (click)="localizationService.setLanguage('fr')">FR</button>
              <button mat-menu-item (click)="localizationService.setLanguage('en')">EN</button>
          </mat-menu>
      </mat-toolbar>
    </header>

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
          background-color: #000000;
          color: #ffffff;
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
          background-color: #ffffff;
          margin-left: 10px;
          margin-right: 10px;
      }

      .logout-button {
          background-color: #ffffff;
          color: black;
      }

      .auth-button:hover {

          background-color: #88a437;
          color: white;
      }

      button {
          background-color: black;
          color: white;
      }

      button:hover {
          color: #88a437;
      }

      mat-icon {
          transform: scale(1.75);
      }
  `]
})
export class HeaderComponent implements OnInit{
  @Input()
  set drawer(matDrawer: MatDrawer) {
    this._drawer = matDrawer;
    this.notificationService.toggleSpinner();
    setTimeout(() => this.notificationService.toggleSpinner(), 2000);
  }
  destroyRef = inject(DestroyRef)


  protected _drawer!: MatDrawer;
  backendService = inject(BackendService);
  notificationService = inject(NotificationService);
  localizationService = inject(LocalizationService)
  dialog = inject(MatDialog);
  router = inject(Router);
  _name! : string
  userInfo = this.backendService.getAuthenticatedUser()

  constructor() {
    effect(() => {
      this._name = this.userInfo().value?.firstname + " " + this.userInfo().value?.lastname?.toUpperCase()
      console.log(this.backendService.authenticated().state);
    })
  }

  ngOnInit() {
  }

  handleAuthButton(){
    const dialogRef = this.dialog.open(AuthenticationDialogComponent, {
      //height: '40%',
      width: '300px'
    });
    if (dialogRef === null)
      this.router.navigate(['/auth']).then(() => alert("Failed to open dialog"))
  }

  logout(){
    this.backendService.firebaseLogOut().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.backendService.localStorageLogout(),
      error: () => this.backendService.localStorageLogout(),
    })
  }
}
