import {AfterContentInit, AfterViewInit, Component, inject, Input} from "@angular/core";
import {AssessmentForm} from "../models/assessmentForm.model";
import {BackendService} from "../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationDialogComponent} from "./dialogs/authentication-dialog.component";
import {AssociateFormDialogComponent} from "./dialogs/associate-form-dialog.component";

@Component({
  selector: "app-assessment-template",
  template: `
    <mat-card>
      <mat-card-header>
        <div mat-card-avatar class="example-header-image"></div>
        <mat-card-title>Code: {{assessment.internshipGeneratedCode}}</mat-card-title>
        <!--<mat-card-subtitle>{{assessment.id}}</mat-card-subtitle>-->
      </mat-card-header>
      <mat-card-content>
        <p>Etudiant : {{assessment.studentIntern.firstname + " " + assessment.studentIntern.lastname}}</p>
        <p>{{isHeadMaster ? "Professeur : " + assessment.supervisor.firstname + " " + assessment.supervisor.lastname : ""}}</p>
      </mat-card-content>
      <mat-card-actions class="button-container">
        <button (click)="fill()" *ngIf="!isHeadMaster" mat-button>Fill</button>
        <button (click)="infos()" *ngIf="isHeadMaster" mat-button>Infos</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .button-container {
      display: flex;
      justify-content: flex-start; /* Align buttons to the start of the container */
    }
  `]
})
export class AssessmentTemplateComponent implements AfterContentInit{
  backendService = inject(BackendService);
  userInfo = this.backendService.getAuthenticatedUser();
  @Input() assessment!: AssessmentForm;
  isHeadMaster!: boolean;

  ngAfterContentInit(): void {
    this.isHeadMaster = (this.backendService.getUserFromLocal()[0] as any).role === "Headmaster" && this.assessment.supervisor?.code !== this.userInfo().value.code;
  }

  fill() {

  }

  infos() {

  }
}
