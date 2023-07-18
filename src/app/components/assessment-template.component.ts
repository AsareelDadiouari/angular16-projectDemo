import {AfterContentInit, AfterViewInit, Component, inject, Input} from "@angular/core";
import {AssessmentForm} from "../models/assessmentForm.model";
import {BackendService} from "../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationDialogComponent} from "./dialogs/authentication-dialog.component";
import {AssociateFormDialogComponent} from "./dialogs/associate-form-dialog.component";
import {FormControl} from "@angular/forms";
import options from "../options";
import {AssessmentFormInfoComponent} from "./dialogs/assessment-form-info.component";
import {Router} from "@angular/router";
import {data} from "autoprefixer";

@Component({
  selector: "app-assessment-template",
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <ng-container *ngIf="!codeEditMode">
             {{assessment.internshipGeneratedCode}}
            <mat-icon (click)="codeEditMode = true" *ngIf="isHeadMaster"> border_color</mat-icon>
          </ng-container>
          <ng-container *ngIf="codeEditMode">
            <span>
              <input type="text" [formControl]="inputValue">
              <mat-icon (click)="changeCode()">check</mat-icon>
              <mat-icon (click)="codeEditMode = false">close</mat-icon>
            </span>
          </ng-container>
          <mat-icon class="completed-badge" *ngIf="options.formIsCompleted(this.assessment)" matTooltip="Completed Assessment">check_circle</mat-icon>
          <mat-icon class="uncompleted-badge" *ngIf="!options.formIsCompleted(this.assessment)" matTooltip="Incomplete Assessment">info</mat-icon>
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Etudiant : {{assessment.studentIntern.firstname + " " + assessment.studentIntern.lastname}}</p>
        <p>{{isHeadMaster ? "Professeur : " + assessment.supervisor.firstname + " " + assessment.supervisor.lastname : ""}}</p>
      </mat-card-content>
      <mat-card-actions class="button-container">
        <button (click)="fill()" *ngIf="isProfessor || (isHeadMaster && this.assessment.supervisor?.code === this.userInfo().value.code)" mat-button>Fill</button>
        <button (click)="infos()"
                *ngIf="(isHeadMaster && this.assessment.supervisor?.code !== this.userInfo().value.code) || ((isProfessor || isHeadMaster) && options.formIsCompleted(this.assessment))"
                mat-button
                [ngClass]="{ 'right-align': options.formIsCompleted(this.assessment) && (this.assessment.supervisor.code === this.userInfo().value.code) }">Infos</button>
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

  `]
})
export class AssessmentTemplateComponent implements AfterContentInit{
  backendService = inject(BackendService);
  dialog = inject(MatDialog);
  userInfo = this.backendService.getAuthenticatedUser();
  @Input() assessment!: AssessmentForm;
  codeEditMode: boolean = false;
  inputValue!: FormControl<string | null>;
  isProfessor: boolean = (this.backendService.getUserFromLocal()[0] as any).role === "Professor"
  isHeadMaster: boolean  = (this.backendService.getUserFromLocal()[0] as any).role === "Headmaster"
  router = inject(Router);

  ngAfterContentInit(): void {
    this.inputValue = new FormControl<string>(options.getValueOrThrow(this.assessment.internshipGeneratedCode));
  }

  fill() {
    this.router.navigate(['/evaluation', this.assessment.id], {state: { data: this.assessment }});
  }

  infos() {
    const dialogRef = this.dialog.open(AssessmentFormInfoComponent, {
      data : this.assessment
    });
  }

  changeCode() {
    this.backendService.updateAssessmentCode(options.getValueOrThrow(this.assessment.id), options.getValueOrThrow(this.inputValue.getRawValue())).subscribe(() =>{
      this.codeEditMode = false;
    })
  }


  protected readonly options = options;
}
