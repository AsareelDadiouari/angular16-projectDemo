import {Component, effect, inject, LOCALE_ID} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LocalizationService} from "../services/localization.service";
import {BackendService} from "../services/backend.service";

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
            <button mat-button matStepperNext i18n>Next</button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="internshipRatingNoteForm">
        <form [formGroup]="internshipRatingNoteForm">
          <ng-template i18n matStepLabel class="titre"><span>B.</span> How do you estimate the intern overall performance</ng-template>
          <mat-form-field>
            <mat-label>Selection</mat-label>
            <mat-select formControlName="internshipRatingNote" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </mat-form-field>
          <div>
            <button mat-button matStepperNext i18n>Next</button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="traineeSkillEvalForm">
        <form [formGroup]="traineeSkillEvalForm">
          <ng-template matStepLabel i18n>Evaluation of the trainee's skills and clothing</ng-template>
          <div class="field-container">
            <mat-label for="autonomy" class="titre" i18n>Demonstrate autonomy</mat-label>
            <mat-select formControlName="autonomy" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="activeListeningSkills" class="titre" i18n>Capable of active listening</mat-label>
            <mat-select formControlName="activeListeningSkills" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="abilityToWork" class="titre" i18n>Demonstrates an ability to work in a team</mat-label>
            <mat-select formControlName="abilityToWork" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>

          </div>
          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="socialAdaptation" class="titre" i18n>Demonstrates a good spirit of social adaptation</mat-label>
            <mat-select formControlName="socialAdaptation" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>
          <mat-divider></mat-divider>


          <div class="field-container">
            <mat-label for="initiative" class="titre" i18n>Demonstrates initiative</mat-label>
            <mat-select formControlName="initiative" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>
          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="imagination" class="titre" i18n>Show imagination</mat-label>
            <mat-select formControlName="imagination" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>

          </div>
          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="analyticalSkills" class="titre" i18n>Demonstrates good analytical skills</mat-label>
            <mat-select formControlName="analyticalSkills" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>
          <mat-divider></mat-divider>


          <div class="field-container">
            <mat-label for="oralSkills" class="titre" i18n>Demonstrates skill in oral communication</mat-label>
            <mat-select formControlName="oralSkills" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>
          <mat-divider></mat-divider>

          <mat-form-field  appearance="fill" class="fill-container">
            <mat-label i18n>Additional notes</mat-label>
            <textarea matInput formControlName="additionalInfo"></textarea>
          </mat-form-field>
          <div>
            <button mat-button matStepperNext i18n>Next</button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="traineeKnowledgeForm">
        <form [formGroup]="traineeKnowledgeForm">
          <ng-template matStepLabel i18n>Assessment of trainee knowledge</ng-template>
          <div class="field-container">
            <mat-label for="writtenCommunicationSkills" class="titre" i18n>Mastering written communication</mat-label>
            <mat-select formControlName="writtenCommunicationSkills" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="fieldOfSpecialization" class="titre" i18n>Knows his field of specialization well</mat-label>
            <mat-select formControlName="fieldOfSpecialization" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>
          <div class="field-container">
            <mat-label for="assumeResponsibilities" class="titre" i18n>Is able to assume the responsibilities related to his task</mat-label>
            <mat-select formControlName="assumeResponsibilities" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>
          <div class="field-container">
            <mat-label for="produceRequestedDocs" class="titre" i18n>Is able to produce the requested documents</mat-label>
            <mat-select formControlName="produceRequestedDocs" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>
          <div class="field-container">
            <mat-label for="makeRecommendations" class="titre" i18n>Is able to make recommendations</mat-label>
            <mat-select formControlName="makeRecommendations" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>
          <div class="field-container">
            <mat-label for="popularizeTerminology" class="titre" i18n>Is able to popularize the terminology</mat-label>
            <mat-select formControlName="popularizeTerminology" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" i18n>
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>

          <mat-form-field appearance="fill" class="fill-container">
            <mat-label i18n>Additional notes</mat-label>
            <textarea matInput formControlName="additionalInfo"></textarea>
          </mat-form-field>
          <div>
            <button mat-button matStepperNext i18n>Next</button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="traineeGlobalEvalForm">
        <form [formGroup]="traineeGlobalEvalForm">
          <ng-template matStepLabel i18n>Overall evaluation of the trainee</ng-template>
          <div class="form-group">
            <mat-form-field>
              <mat-label>Selection</mat-label>
              <mat-select formControlName="rating" appearance="outline">
                <ng-container>
                  <mat-option *ngFor="let item of selections" [value]="item">
                    {{item}}
                  </mat-option>
                </ng-container>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field  appearance="fill" class="fill-container">
            <mat-label i18n>Additional notes</mat-label>
            <textarea matInput formControlName="additionalInfo"></textarea>
          </mat-form-field>
          <div>
            <button mat-button matStepperNext i18n>Next</button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="supervisorForm">
        <form [formGroup]="supervisorForm" >
          <ng-template matStepLabel i18n>Supervisor Identification</ng-template>

          <div class="form-group">
            <mat-form-field>
              <mat-label for="Code">Code</mat-label>
              <input type="text" id="code" formControlName="code" matInput>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field>
              <mat-label for="email">Email</mat-label>
              <input  type="text" id="email" formControlName="email" matInput>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field>
              <mat-label i18n for="firstname">Firstname</mat-label>
              <input type="text" id="firstname" formControlName="firstname" matInput>
            </mat-form-field>

          </div>

          <div class="form-group">
            <mat-form-field>
              <mat-label i18n for="lastname">Lastname</mat-label>
              <input type="text" id="lastname" formControlName="lastname" matInput>
            </mat-form-field>
          </div>

        </form>
      </mat-step>

    </mat-stepper>
    <button [disabled]="studentInfoForm.invalid" class="submit-button" mat-raised-button color="primary" (click)="submitForm()">Submit</button>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-height: 88vh;
    }
    .mat-form-field.fill-container,
    .mat-form-field.fill-container .mat-form-field-infix,
    .mat-form-field.fill-container .mat-form-field-flex,
    .mat-form-field.fill-container .mat-form-field-wrapper {
      height: 100%;
      width: 100%;
    }

    .mat-form-field.fill-container textarea {
      height: calc(100% - 25px);
    }

    .field-container {
      display: flex;
      align-items: center;
      justify-content: center;
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

    .titre {
      font-size: 13px;
    }
  `],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }]
})
export class AssessmentFormComponent {
  fb = inject(FormBuilder)
  translationService = inject(LocalizationService)
  backendService = inject(BackendService);
  userInfo = this.backendService.getAuthenticatedUser();

  constructor() {
    effect(() => {})
  }

  selections = [this.translationService.getLanguage() === "en" ? 'Execellent : Excellent performance that meets the standards achieved' : "Excellent : Excellentes performances qui répondent aux normes atteintes",
    this.translationService.getLanguage() === "en" ?'Very satisfactory : performance which often exceeds the standards obtained' : 'Très satisfaisant : Des performances très satisfaisantes qui dépassent souvent les standards obtenus',
    this.translationService.getLanguage() === "en" ?'Satisfactory : yields that match achieved standards' : 'Satisfaisant : Des rendements satisfaisants qui correspondent aux normes atteintes',
    this.translationService.getLanguage() === "en" ?'Unsatisfactory: performance that does not meet achieved standards' : 'Insatisfaisant : performances qui ne répondent pas aux normes atteintes']

  studentInfoForm = this.fb.group({
    permanentCode: ['', [Validators.required, Validators.pattern(/^([a-zA-Z]{4})(\d{2})(\d{2})(\d{2})(\d{2})$/)]],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required, ],
  });

  internshipRatingNoteForm = this.fb.group({
    internshipRatingNote: ['To determine'],
  });

  traineeSkillEvalForm = this.fb.group({
    autonomy : ['To determine'],
    activeListeningSkills : ['To determine'],
    abilityToWork : ['To determine'],
    socialAdaptation : ['To determine'],
    initiative : ['To determine'],
    imagination : ['To determine'],
    analyticalSkills : ['To determine'],
    oralSkills : ['To determine'],
    additionalInfo : [''],
  });

  traineeKnowledgeForm = this.fb.group({
    writtenCommunicationSkills :['To determine'],
    fieldOfSpecialization : ['To determine'],
    assumeResponsibilities : ['To determine'],
    produceRequestedDocs : ['To determine'],
    makeRecommendations : ['To determine'],
    popularizeTerminology : ['To determine'],
    additionalInfo : [''],
  });

  traineeGlobalEvalForm = this.fb.group({
    rating : ['To determine'],
    additionalInfo : [''],
  });

  supervisorForm = this.fb.group({
    id: ['To determine'],
    code : [this.userInfo.state ? this.userInfo.value.code : '', [Validators.required, Validators.pattern(/^([a-zA-Z]{4})(\d{2})(\d{2})(\d{2})(\d{2})$/)]],
    email : [this.userInfo.state ? this.userInfo.value.email : ''],
    firstname : [this.userInfo.state ? this.userInfo.value.firstname : ''],
    lastname : [this.userInfo.state ? this.userInfo.value.lastname : ''],
    studentCode: [''],
  });

  submitForm() {
    console.log(this.studentInfoForm.getRawValue())

    console.log(this.internshipRatingNoteForm.getRawValue())

    console.log(this.traineeSkillEvalForm.getRawValue())

    console.log(this.traineeKnowledgeForm.getRawValue())

    console.log(this.traineeGlobalEvalForm.getRawValue())

    console.log(this.supervisorForm.getRawValue())

  }
}
