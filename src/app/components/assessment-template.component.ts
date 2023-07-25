import {AfterContentInit, Component, inject, Input} from "@angular/core";
import {AssessmentForm} from "../models/assessmentForm.model";
import {BackendService} from "../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import options from "../options";
import {AssessmentFormInfoComponent} from "./dialogs/assessment-form-info.component";
import {Router} from "@angular/router";

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
              <mat-icon (click)="codeEditMode = false">close</mat-icon>
            </span>
                  </ng-container>
                  <mat-icon class="completed-badge" *ngIf="options.formIsCompleted(this.assessment)"
                            matTooltip="Completed Assessment">done_outline
                  </mat-icon>
                  <mat-icon class="uncompleted-badge" [ngStyle]="{color: '#f5d60a'}" *ngIf="!options.formIsCompleted(this.assessment)"
                            matTooltip="Incomplete Assessment">hourglass_empty
                  </mat-icon>
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Etudiant : {{assessment.studentIntern.firstname + " " + assessment.studentIntern.lastname}}</p>
                <p>{{isHeadMaster ? "Professeur : " + assessment.supervisor.firstname + " " + assessment.supervisor.lastname : ""}}</p>
              </mat-card-content>
              <mat-card-actions class="button-container">
                <button (click)="fill()"
                        matTooltip="Fill"
                        *ngIf="isProfessor || (isHeadMaster && this.assessment.supervisor?.code === this.userInfo().value.code)"
                        mat-button><mat-icon>keyboard</mat-icon>
                </button>
                <button (click)="infos()"
                        matTooltip="Informations"
                        *ngIf="(isHeadMaster && this.assessment.supervisor?.code !== this.userInfo().value.code) || ((isProfessor || isHeadMaster) && options.formIsCompleted(this.assessment))"
                        mat-button
                        [ngClass]="{ 'right-align': options.formIsCompleted(this.assessment) && (this.assessment.supervisor.code === this.userInfo().value.code) }">
                  <mat-icon  >info</mat-icon>
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
export class AssessmentTemplateComponent implements AfterContentInit {
  backendService = inject(BackendService);
  dialog = inject(MatDialog);
  userInfo = this.backendService.getAuthenticatedUser();
  @Input() assessment!: AssessmentForm;
  codeEditMode: boolean = false;
  inputValue!: FormControl<string | null>;
  isProfessor: boolean = (this.backendService.getUserFromLocal()[0] as any).role === "Professor"
  isHeadMaster: boolean = (this.backendService.getUserFromLocal()[0] as any).role === "Headmaster"
  router = inject(Router);
  protected readonly options = options;

  ngAfterContentInit(): void {
    this.inputValue = new FormControl<string>(options.getValueOrThrow(this.assessment.internshipGeneratedCode));
  }

  fill() {
    this.router.navigate(['/evaluation', this.assessment.id], {state: {data: this.assessment}});
  }

  infos() {
    const dialogRef = this.dialog.open(AssessmentFormInfoComponent, {
      data: this.assessment
    });
  }

  changeCode() {
    this.backendService.updateAssessmentCode(options.getValueOrThrow(this.assessment.id), options.getValueOrThrow(this.inputValue.getRawValue())).subscribe(() => {
      this.codeEditMode = false;
    })
  }
}
