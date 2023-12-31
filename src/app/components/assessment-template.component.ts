import {AfterContentInit, Component, DestroyRef, inject, Input, OnInit} from "@angular/core";
import {AssessmentForm} from "../models/entities/assessmentForm.model";
import {BackendService} from "../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import utils from "../utils";
import {AssessmentFormInfoComponent} from "./dialogs/assessment-form-info.component";
import {Router} from "@angular/router";
import {LocalizationService} from "../services/localization.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: "app-assessment-template",
  template: `

            <mat-card class="max-w-sm mat-elevation-z3 p-4 transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110 mr-8">
              <mat-card-header
                [ngStyle]="{'background-color' : options.formIsCompleted(this.assessment) ? '#c9e8d7' : '#fefbe6'}">
                <mat-card-title>
                  <ng-container *ngIf="!codeEditMode">
                    <span [ngStyle]="{color: '#2e3952'}">{{assessment.internshipGeneratedCode}}</span>
                    <mat-icon (click)="codeEditMode = true" *ngIf="isHeadMaster"> border_color</mat-icon>
                  </ng-container>
                  <ng-container *ngIf="codeEditMode">
            <span>
              <input type="text" [formControl]="inputValue">
              <mat-icon (click)="changeCode()">check</mat-icon>
              <mat-icon (click)="codeEditMode = false;inputValue.setValue(assessment.internshipGeneratedCode!)">close</mat-icon>
            </span>
                  </ng-container>
                  <mat-icon class="completed-badge" *ngIf="options.formIsCompleted(this.assessment)"
                            [matTooltip]="localizationService.currentLanguage() === 'en' ? 'Completed Assessment' : 'Formulaire complété'">done_outline
                  </mat-icon>
                  <mat-icon class="uncompleted-badge" [ngStyle]="{color: '#f5d60a'}" *ngIf="!options.formIsCompleted(this.assessment)"
                            [matTooltip]="localizationService.currentLanguage() === 'en' ? 'Incompleted Assessment' : 'Formulaire en cours'">hourglass_empty
                  </mat-icon>
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>{{'Student : ' | translate}}{{assessment.studentIntern.firstname + " " + assessment.studentIntern.lastname}}</p>
                <p>{{isHeadMaster ? ("Professor : " | translate) + assessment.supervisor.firstname + " " + assessment.supervisor.lastname : ""}}</p>
              </mat-card-content>
              <mat-card-actions class="button-container">
                <button (click)="fill()"
                        [matTooltip]="localizationService.currentLanguage() === 'en' ? 'Fill' : 'Remplir'"
                        *ngIf="isProfessor || (isHeadMaster && this.assessment.supervisor?.code === this.userInfo().value.code)"
                        mat-button><mat-icon>keyboard</mat-icon>
                </button>
                <button (click)="infos()"
                        [matTooltip]="localizationService.currentLanguage() === 'en' ? 'Informations' : 'Voir les informations'"
                        *ngIf="(isHeadMaster && this.assessment.supervisor?.code !== this.userInfo().value.code) || ((isProfessor || isHeadMaster) && options.formIsCompleted(this.assessment))"
                        mat-button
                        [ngClass]="{ 'right-align': options.formIsCompleted(this.assessment) && (this.assessment.supervisor.code === this.userInfo().value.code) }">
                  <mat-icon>info</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
  `,
  styles: [`
    .button-container {
      display: flex;
      justify-content: flex-start; /* Align buttons to the start of the container */
      min-width: 330px;
    }

    mat-icon {
      cursor: pointer;
      pointer-events: auto;
    }

    :host {
      display: flex;
      justify-content: center; /* Center the component horizontally */
      align-items: center; /* Center the component vertically */
      height: 100%;
    }

    mat-card {
      width: 100%;
      max-width: 400px;
    }

    mat-card-content {
      text-align: center; /* Center the content within the card */
    }

    mat-card-title {
      display: flex;
      justify-content: center; /* Center the title horizontally */
      align-items: center; /* Center the title vertically */
      margin-left: 60px;
    }

    .completed-badge {
      color: green;
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .uncompleted-badge {
      color: yellow;
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .badge {
      border-bottom: 2px solid;
      padding-bottom: 2px;
    }

    .right-align {
      margin-left: auto;
    }

    /* Add this to your global styles.css or styles.scss */
    .scroll-container {
      display: flex;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    mat-card-header {
      padding: 6px;
    }

    text-blue-950 {
      color: #1565c0;
    }

    text-primary-700 {
      color: #1a237e;
    }

    text-gray-600 {
      color: #757575;
    }

    text-red-600 {
      color: #e53935;
    }

    .max-w-sm {
      max-width: 20rem;
    }

    .max-h-170 {
      max-height: 170px;
    }

    .transition {
      transition-property: all;
    }

    .delay-150 {
      transition-delay: 150ms;
    }

    .duration-150 {
      transition-duration: 150ms;
    }

    .ease-in-out {
      transition-timing-function: ease-in-out;
    }

    .hover\\:translate-y-1:hover {
      transform: translateY(-0.25rem);
    }

    .hover\\:scale-110:hover {
      transform: scale(1.1);
    }
  `]
})
export class AssessmentTemplateComponent implements OnInit {
  backendService = inject(BackendService);
  notificationService = inject(NotificationService);
  localizationService = inject(LocalizationService);
  dialog = inject(MatDialog);
  userInfo = this.backendService.getAuthenticatedUser();
  @Input() assessment!: AssessmentForm;
  destroyRef = inject(DestroyRef)

  codeEditMode: boolean = false;
  inputValue!: FormControl<string | null>;
  isProfessor: boolean = this.backendService.authenticated().value?.role === "Professor"
  isHeadMaster: boolean = this.backendService.authenticated().value?.role === "Headmaster"
  router = inject(Router);
  protected readonly options = utils;

  constructor() {
  }

  ngOnInit(): void {
    this.inputValue = new FormControl<string>(utils.getValueOrThrow(this.assessment.internshipGeneratedCode));
  }

  fill() {
    this.router.navigate(['/evaluation', this.assessment.id], {state: {data: this.assessment}});
  }

  infos() {
    const dialogRef = this.dialog.open(AssessmentFormInfoComponent, {
      width: '600px',
      maxHeight: '80vh',
      data: this.assessment
    });
  }

  changeCode() {
    if (/\d{2}(HIV|ETE|AUT)\d{2}[A-Z]{5}$/.test(utils.getValueOrThrow(this.inputValue.getRawValue()?.trim()))){
      this.backendService.updateAssessmentCode(utils.getValueOrThrow(this.assessment.id), utils.getValueOrThrow(this.inputValue.getRawValue()?.trim())).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.codeEditMode = false;
      })
    } else {
      this.notificationService.showErrorNotification("Invalid Code !")
    }
  }
}
