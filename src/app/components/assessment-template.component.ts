import {AfterContentInit, AfterViewInit, Component, inject, Input} from "@angular/core";
import {AssessmentForm} from "../models/assessmentForm.model";
import {BackendService} from "../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationDialogComponent} from "./dialogs/authentication-dialog.component";
import {AssociateFormDialogComponent} from "./dialogs/associate-form-dialog.component";
import {FormControl} from "@angular/forms";
import options from "../options";

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
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Etudiant : {{assessment.studentIntern.firstname + " " + assessment.studentIntern.lastname}}</p>
        <p>{{isHeadMaster ? "Professeur : " + assessment.supervisor.firstname + " " + assessment.supervisor.lastname : ""}}</p>
      </mat-card-content>
      <mat-card-actions class="button-container">
        <button (click)="fill()" *ngIf="isProfessor || (isHeadMaster && this.assessment.supervisor?.code === this.userInfo().value.code)" mat-button>Fill</button>
        <button (click)="infos()" *ngIf="isHeadMaster && this.assessment.supervisor?.code !== this.userInfo().value.code" mat-button>Infos</button>
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

  `]
})
export class AssessmentTemplateComponent implements AfterContentInit{
  backendService = inject(BackendService);
  userInfo = this.backendService.getAuthenticatedUser();
  @Input() assessment!: AssessmentForm;
  codeEditMode: boolean = false;
  inputValue!: FormControl<string | null>;
  isProfessor: boolean = (this.backendService.getUserFromLocal()[0] as any).role === "Professor"
  isHeadMaster: boolean  = (this.backendService.getUserFromLocal()[0] as any).role === "Headmaster"

  ngAfterContentInit(): void {
    this.inputValue = new FormControl<string>(options.getValueOrThrow(this.assessment.internshipGeneratedCode));
  }

  fill() {

  }

  infos() {

  }

  changeCode() {
    this.backendService.updateAssessmentCode(options.getValueOrThrow(this.assessment.id), options.getValueOrThrow(this.inputValue.getRawValue())).subscribe(() =>{
      this.codeEditMode = false;
    })
  }
}
