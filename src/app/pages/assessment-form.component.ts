import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assessment-form',
  template: `
    <h2>Assessment Form</h2>
    <mat-stepper orientation="vertical" #stepper>
      <mat-step [stepControl]="studentInfoForm">
        <form [formGroup]="studentInfoForm">
          <ng-template i18n matStepLabel><span>A.</span> Intern Info</ng-template>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label i18n for="permanentCode">Permanent Code : </mat-label>
              <input type="text" id="permanentCode" formControlName="permanentCode" matInput>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label i18n for="firstname">Firstname</mat-label>
              <input type="text" id="firstname" formControlName="firstname" matInput>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label i18n for="lastname">Lastname</mat-label>
              <input type="text" id="lastname" formControlName="lastname" matInput>
            </mat-form-field>
          </div>
          <div>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>
      <mat-step [stepControl]="internshipRatingNoteForm">
        <form [formGroup]="internshipRatingNoteForm">
          <ng-template i18n matStepLabel><span>B.</span> How do you estimate the intern overall performance</ng-template>
          <mat-select formControlName="internshipRatingNote" appearance="outline">
            <mat-option value="two">Excellent performance that meets the standards achieved</mat-option>
            <mat-option value="one">Very satisfactory performance which often exceeds the standards obtained</mat-option>
            <mat-option value="two">Satisfactory yields that match achieved standards</mat-option>
            <mat-option value="two">Unsatisfactory: performance that does not meet achieved standards</mat-option>
          </mat-select>
          <div>
            <button mat-button matStepperNext>Next</button>
          </div>
        </form>
      </mat-step>
    </mat-stepper>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-height: 88vh;
    }

    .assessment-form {
      display: block;
      min-width: 150px;
      max-width: 500px;
      width: 100%;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .submit-button {
      text-align: center;
      margin-top: 20px;
    }

    .number {
      font-size: 18px;
    }
  `]
})
export class AssessmentFormComponent {
  fb = inject(FormBuilder)

  studentInfoForm = this.fb.group({
    permanentCode: ['', Validators.required],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
  })

  internshipRatingNoteForm = this.fb.group({
    internshipRatingNote: ['To determine'],
  })

  submitForm() {
  }
}
