import {
  AfterContentInit,
  AfterViewInit,
  Component,
  computed, DestroyRef,
  effect,
  inject,
  LOCALE_ID,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LocalizationService} from "../services/localization.service";
import {BackendService} from "../services/backend.service";
import {Intern} from "../models/entities/intern";
import {
  combineLatestWith,
  concatMap,
  filter,
  find,
  forkJoin,
  from,
  map,
  of,
  startWith,
  switchMap,
  take,
  tap
} from 'rxjs';
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {MatOption} from "@angular/material/core";
import {MatAutocomplete} from "@angular/material/autocomplete";
import {AssessmentForm, TraineeGlobalEval, TraineeKnowledge, TraineeSkillEval} from "../models/entities/assessmentForm.model";
import {MatDialog} from "@angular/material/dialog";
import {AssociateFormDialogComponent} from "../components/dialogs/associate-form-dialog.component";
import {NotificationService} from "../services/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import options from "../utils";
import {combineLatest} from "rxjs/internal/operators/combineLatest";

@Component({
  selector: 'app-assessment-form',
  template: `

    <h2>{{'Assessment Form' | translate}}</h2>
    <mat-stepper class="assessment-form" orientation="vertical" #stepper>
      <mat-step [stepControl]="studentInfoForm">
        <form [formGroup]="studentInfoForm">
          <ng-template matStepLabel><span>A.</span> {{'Intern Info' | translate}}</ng-template>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label for="permanentCode">{{'Permanent Code' | translate}}</mat-label>
              <mat-error *ngIf="this.markErrorStudentCode">{{'Unrecognized Permanent code' | translate}}</mat-error>
              <input type="text" id="permanentCode" formControlName="permanentCode" [matAutocomplete]="auto" matInput>
              <mat-autocomplete #matAutocompleteStudentCode (optionSelected)="onOptionSelected($event)" #auto="matAutocomplete">
                <mat-option *ngFor="let student of students()" [value]="student.code">
                  {{student.code}}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label for="firstname">{{'Firstname' | translate}}</mat-label>
              <input type="text" id="firstname" formControlName="firstname" matInput>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label for="lastname">{{'Lastname' | translate}}</mat-label>
              <input type="text" id="lastname" formControlName="lastname" matInput>
            </mat-form-field>
          </div>
          <div>
            <button mat-button matStepperNext>{{'Next' | translate}}</button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="internshipRatingNoteForm">
        <form [formGroup]="internshipRatingNoteForm">
          <ng-template matStepLabel class="titre"><span>B.</span> {{'How do you estimate the intern overall performance' | translate}}</ng-template>
          <mat-form-field>
            <mat-label>{{'Selection' | translate}}</mat-label>
            <mat-select formControlName="internshipRatingNote" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </mat-form-field>
          <div>
            <button mat-button matStepperNext>{{'Next' | translate}}</button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="traineeSkillEvalForm">
        <form [formGroup]="traineeSkillEvalForm">
          <ng-template matStepLabel>{{'Evaluation of the trainee\\'s skills and clothing' | translate}}</ng-template>
          <div class="field-container">
            <mat-label for="autonomy" class="titre">{{'Demonstrate autonomy' | translate}}</mat-label>
            <mat-select formControlName="autonomy" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item" >
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="activeListeningSkills" class="titre">{{'Capable of active listening' | translate}}</mat-label>
            <mat-select formControlName="activeListeningSkills" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="abilityToWork" class="titre">{{'Demonstrates an ability to work in a team' | translate}}</mat-label>
            <mat-select formControlName="abilityToWork" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>

          </div>
          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="socialAdaptation" class="titre">{{'Demonstrates a good spirit of social adaptation' | translate}}</mat-label>
            <mat-select formControlName="socialAdaptation" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>
          <mat-divider></mat-divider>


          <div class="field-container">
            <mat-label for="initiative" class="titre">{{'Demonstrates initiative' | translate}}</mat-label>
            <mat-select formControlName="initiative" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>
          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="imagination" class="titre">{{'Show imagination' | translate}}</mat-label>
            <mat-select formControlName="imagination" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>

          </div>
          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="analyticalSkills" class="titre">{{'Demonstrates good analytical skills' | translate}}</mat-label>
            <mat-select formControlName="analyticalSkills" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>
          <mat-divider></mat-divider>


          <div class="field-container">
            <mat-label for="oralSkills" class="titre">{{'Demonstrates skill in oral communication' | translate}}</mat-label>
            <mat-select formControlName="oralSkills" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>
          <mat-divider></mat-divider>

          <mat-form-field  appearance="fill" class="fill-container">
            <mat-label>{{'Additional notes' | translate}}</mat-label>
            <textarea matInput formControlName="additionalInfo"></textarea>
          </mat-form-field>
          <div>
              <button mat-button matStepperNext>{{'Next' | translate}}</button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="traineeKnowledgeForm">
        <form [formGroup]="traineeKnowledgeForm">
          <ng-template matStepLabel>{{'Assessment of trainee knowledge' | translate}}</ng-template>
          <div class="field-container">
            <mat-label for="writtenCommunicationSkills" class="titre">{{'Mastering written communication' | translate}}</mat-label>
            <mat-select formControlName="writtenCommunicationSkills" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>

          <div class="field-container">
            <mat-label for="fieldOfSpecialization" class="titre">{{'Knows his field of specialization well' | translate}}</mat-label>
            <mat-select formControlName="fieldOfSpecialization" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>
          <div class="field-container">
            <mat-label for="assumeResponsibilities" class="titre">{{'Is able to assume the responsibilities related to his task' | translate}}</mat-label>
            <mat-select formControlName="assumeResponsibilities" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>
          <div class="field-container">
            <mat-label for="produceRequestedDocs" class="titre">{{'Is able to produce the requested documents' | translate}}</mat-label>
            <mat-select formControlName="produceRequestedDocs" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>
          <div class="field-container">
            <mat-label for="makeRecommendations" class="titre">{{'Is able to make recommendations' | translate}}</mat-label>
            <mat-select formControlName="makeRecommendations" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>
          <div class="field-container">
            <mat-label for="popularizeTerminology" class="titre">{{'Is able to popularize the terminology'|translate}}</mat-label>
            <mat-select formControlName="popularizeTerminology" appearance="outline">
              <ng-container>
                <mat-option *ngFor="let item of selections" [value]="item">
                  {{item}}
                </mat-option>
              </ng-container>
            </mat-select>
          </div>

          <mat-divider></mat-divider>

          <mat-form-field appearance="fill" class="fill-container">
              <mat-label>{{'Additional notes' | translate}}</mat-label>
            <textarea matInput formControlName="additionalInfo"></textarea>
          </mat-form-field>
          <div>
              <button mat-button matStepperNext>{{'Next' | translate}}</button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="traineeGlobalEvalForm">
        <form [formGroup]="traineeGlobalEvalForm">
          <ng-template matStepLabel>{{'Overall evaluation of the trainee'|translate}}</ng-template>
          <div class="form-group">
            <mat-form-field>
                <mat-label>{{'Selection' | translate}}</mat-label>
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
              <mat-label>{{'Additional notes' | translate}}</mat-label>
            <textarea matInput formControlName="additionalInfo"></textarea>
          </mat-form-field>
          <div>
              <button mat-button matStepperNext>{{'Next' | translate}}</button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="supervisorForm">
        <form [formGroup]="supervisorForm" >
          <ng-template matStepLabel>{{'Supervisor Identification' | translate}}</ng-template>

          <div class="form-group">
            <mat-form-field>
              <mat-label for="Code">Code</mat-label>
              <input type="text" id="code" formControlName="code" matInput>
              <mat-error *ngIf="this.markErrorSupervisorCode">{{'Unrecognized Permanent code' | translate}}</mat-error>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field>
              <mat-label for="email">{{'Email' | translate}}</mat-label>
              <input  type="text" id="email" formControlName="email" matInput>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field>
              <mat-label for="firstname">{{'Firstname' | translate}}</mat-label>
              <input type="text" id="firstname" formControlName="firstname" matInput>
            </mat-form-field>

          </div>

          <div class="form-group">
            <mat-form-field>
              <mat-label for="lastname">{{'Lastname' | translate}}</mat-label>
              <input type="text" id="lastname" formControlName="lastname" matInput>
            </mat-form-field>
          </div>

        </form>
      </mat-step>

    </mat-stepper>
    <button [disabled]="studentInfoForm.invalid || supervisorForm.invalid" class="submit-button" mat-raised-button color="primary" (click)="submitForm()">{{'Submit' | translate}}</button>
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
      min-width: 400px;
      width: 100%;
    }



    .form-group {
      margin-bottom: 20px;
    }

    .submit-button {
      margin-top: 20px;
      float: right;
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
export class AssessmentFormComponent implements AfterContentInit, AfterViewInit{
  fb = inject(FormBuilder);
  translationService = inject(LocalizationService);
  backendService = inject(BackendService);
  dialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  notificationService = inject(NotificationService);
  userInfo = this.backendService.getAuthenticatedUser();
  selectedStudent!: Intern | undefined;
  assessmentFormRouter: AssessmentForm | undefined;
  updateMode =  this.activatedRoute.snapshot.paramMap.get('id?') !== null;
  @ViewChild("matAutocompleteStudentCode") matAutocompleteStudentCode!: MatAutocomplete
  destroyRef = inject(DestroyRef)

  markErrorStudentCode: boolean = false;
  markErrorSupervisorCode: boolean = false;

  constructor() {
    effect(() => {
      this.supervisorForm.get("code")?.setValue(this.userInfo().state ? this.userInfo().value.code : '');
      this.supervisorForm.get("email")?.setValue(this.userInfo().state ? this.userInfo().value.email : '');
      this.supervisorForm.get("firstname")?.setValue(this.userInfo().state ? this.userInfo().value.firstname : '');
      this.supervisorForm.get("lastname")?.setValue(this.userInfo().state ? this.userInfo().value.lastname : '');

      this.studentInfoForm.get("lastname")?.setValue(this.userInfo().state ? this.studentInfoForm.get("lastname")!.value : '');
      this.studentInfoForm.get("firstname")?.setValue(this.userInfo().state ? this.studentInfoForm.get("firstname")!.value : '');
      this.studentInfoForm.get("permanentCode")?.setValue(this.userInfo().state ? this.studentInfoForm.get("permanentCode")!.value : '');

      this.selections = [this.translationService.currentLanguage() === "en" ? 'Execellent : Excellent performance that meets the standards achieved' : "Excellent : Excellentes performances qui répondent aux normes atteintes",
          this.translationService.currentLanguage() === "en" ?'Very satisfactory : performance which often exceeds the standards obtained' : 'Très satisfaisant : Des performances très satisfaisantes qui dépassent souvent les standards obtenus',
          this.translationService.currentLanguage() === "en" ?'Satisfactory : yields that match achieved standards' : 'Satisfaisant : Des rendements satisfaisants qui correspondent aux normes atteintes',
          this.translationService.currentLanguage() === "en" ?'Unsatisfactory: performance that does not meet achieved standards' : 'Insatisfaisant : performances qui ne répondent pas aux normes atteintes']

      !this.backendService.authenticated().state && this.updateMode ? this.router.navigate(['/']) : '';
    })
  }

  ngAfterViewInit() {
    this.studentInfoForm.controls.permanentCode.valueChanges.subscribe(value => {
      if(this.studentInfoForm.controls.permanentCode.valid){
        this.backendService.getInternByPermanentCode(options.getValueOrThrow(this.studentInfoForm.get('permanentCode')?.value)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
          if (value === undefined){
            this.markErrorStudentCode = true;
            this.studentInfoForm.controls.permanentCode.setErrors({customError:true});
            this.studentInfoForm.controls.lastname.reset();
            this.studentInfoForm.controls.firstname.reset();

          } else {
            this.markErrorStudentCode = false;
            this.studentInfoForm.controls.lastname.setValue(value.lastname);
            this.studentInfoForm.controls.firstname.setValue(value.firstname);
          }
        })
      }
    })

    this.supervisorForm.controls.code.valueChanges.subscribe(value => {
      if (this.supervisorForm.controls.code.valid){
        this.backendService.getSupervisorByPermanentCode(options.getValueOrThrow(this.supervisorForm.get('code')?.value)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {

          if(value === undefined){
            this.markErrorSupervisorCode = true;
            this.supervisorForm.controls.code.setErrors({customError:true});

            this.supervisorForm.controls.lastname.reset();
            this.supervisorForm.controls.firstname.reset();
            this.supervisorForm.controls.email.reset();
          } else {
            this.markErrorSupervisorCode = false;

            this.supervisorForm.controls.lastname.setValue(value.lastname);
            this.supervisorForm.controls.firstname.setValue(value.firstname);
            this.supervisorForm.controls.email.setValue(value.email);
          }
        })
      }
    })
  }

  ngAfterContentInit() {
    of(history.state.data).subscribe((value: AssessmentForm | undefined) => {
      this.assessmentFormRouter = value;

      if (this.assessmentFormRouter){

        this.internshipRatingNoteForm.patchValue({
          internshipRatingNote: this.assessmentFormRouter?.internshipRatingNote
        })

        this.studentInfoForm.patchValue({
          permanentCode: this.assessmentFormRouter.studentIntern.code,
          firstname: this.assessmentFormRouter.studentIntern.firstname,
          lastname: this.assessmentFormRouter.studentIntern.lastname,
        });

        this.traineeSkillEvalForm.patchValue({
          autonomy : this.assessmentFormRouter?.traineeSkillEval?.autonomy,
          activeListeningSkills : this.assessmentFormRouter?.traineeSkillEval?.activeListeningSkills,
          abilityToWork :this.assessmentFormRouter?.traineeSkillEval?.abilityToWork,
          socialAdaptation : this.assessmentFormRouter?.traineeSkillEval?.socialAdaptation,
          initiative : this.assessmentFormRouter?.traineeSkillEval?.initiative,
          imagination : this.assessmentFormRouter?.traineeSkillEval?.imagination,
          analyticalSkills : this.assessmentFormRouter?.traineeSkillEval?.analyticalSkills,
          oralSkills : this.assessmentFormRouter?.traineeSkillEval?.oralSkills,
          additionalInfo : this.assessmentFormRouter?.traineeSkillEval?.additionalInfo,
        });

        this.traineeKnowledgeForm.patchValue({
          writtenCommunicationSkills : this.assessmentFormRouter.traineeKnowledge?.writtenCommunicationSkills,
          fieldOfSpecialization : this.assessmentFormRouter.traineeKnowledge?.fieldOfSpecialization,
          assumeResponsibilities :  this.assessmentFormRouter.traineeKnowledge?.assumeResponsibilities,
          produceRequestedDocs :  this.assessmentFormRouter.traineeKnowledge?.produceRequestedDocs,
          makeRecommendations :  this.assessmentFormRouter.traineeKnowledge?.makeRecommendations,
          popularizeTerminology :  this.assessmentFormRouter.traineeKnowledge?.popularizeTerminology,
          additionalInfo :  this.assessmentFormRouter.traineeKnowledge?.additionalInfo,
        });

        this.traineeGlobalEvalForm.patchValue({
          rating : this.assessmentFormRouter.traineeGlobalEval?.rating,
          additionalInfo : this.assessmentFormRouter.traineeGlobalEval?.additionalInfo,
        });

        this.supervisorForm.patchValue({
          id: this.assessmentFormRouter.supervisor.id,
          code : this.assessmentFormRouter.supervisor.code,
          email : this.assessmentFormRouter.supervisor.email,
          firstname : this.assessmentFormRouter.supervisor.firstname,
          lastname : this.assessmentFormRouter.supervisor.lastname,
          studentCode: this.assessmentFormRouter.supervisor.studentCode,
        });
      }
    });
  }

  selections!: string[]

  internshipRatingNoteForm = this.fb.group({
    internshipRatingNote: [''],
  });

  studentInfoForm = this.fb.group({
    permanentCode: ['', [Validators.required, Validators.pattern(/^([a-zA-Z]{4})(\d{2})(\d{2})(\d{2})(\d{2})$/)]],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required, ],
  });

  students = toSignal<Intern[]>(this.studentInfoForm.controls['permanentCode'].valueChanges.pipe(
    switchMap((value) => {
      if (this.backendService.authenticated().state)
        return this.backendService.getStudents(value!.toUpperCase())
      return []
    }),
    tap((value) => {
      this.matAutocompleteStudentCode.optionSelected.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.selectedStudent = value.find(val => val.code === this.studentInfoForm.controls['permanentCode'].value);
          if (this.selectedStudent){
            this.studentInfoForm.get('firstname')?.setValue(this.selectedStudent.firstname)
            this.studentInfoForm.get('lastname')?.setValue(this.selectedStudent.lastname)
          }
        }
      )
    })
  ))

  traineeSkillEvalForm = this.fb.group({
    autonomy : [''],
    activeListeningSkills : [''],
    abilityToWork : [''],
    socialAdaptation : [''],
    initiative : [''],
    imagination : [''],
    analyticalSkills : [''],
    oralSkills : [''],
    additionalInfo : [''],
  });

  traineeKnowledgeForm = this.fb.group({
    writtenCommunicationSkills :[''],
    fieldOfSpecialization : [''],
    assumeResponsibilities : [''],
    produceRequestedDocs : [''],
    makeRecommendations : [''],
    popularizeTerminology : [''],
    additionalInfo : [''],
  });

  traineeGlobalEvalForm = this.fb.group({
    rating : [''],
    additionalInfo : [''],
  });

  supervisorForm = this.fb.group({
    id: [''],
    code : ['', [Validators.required, Validators.pattern(/^([a-zA-Z]{4})(\d{2})(\d{2})(\d{2})(\d{2})$/)]],
    email : [''],
    firstname : [''],
    lastname : [''],
    studentCode: [''],
  });

  submitForm() {
    const form = {
      supervisor: this.userInfo().state ? this.userInfo().value : this.supervisorForm.getRawValue(),
      studentIntern : this.userInfo().state ? this.selectedStudent === undefined ? this.assessmentFormRouter?.studentIntern : this.selectedStudent : { code: this.studentInfoForm.getRawValue().permanentCode, ...Object.assign({}, this.studentInfoForm.getRawValue()) },
      internshipRatingNote: this.internshipRatingNoteForm.getRawValue().internshipRatingNote as string,
      traineeSkillEval : this.traineeSkillEvalForm.getRawValue() as TraineeSkillEval,
      traineeKnowledge: this.traineeKnowledgeForm.getRawValue() as TraineeKnowledge,
      traineeGlobalEval: this.traineeGlobalEvalForm.getRawValue() as TraineeGlobalEval
    } as AssessmentForm;

    if ((form.studentIntern as any).permanentCode)
      delete (form.studentIntern as any).permanentCode

   if (this.updateMode){
     form.internshipGeneratedCode = this.assessmentFormRouter?.internshipGeneratedCode;
     form.id = options.getValueOrThrow(this.activatedRoute.snapshot.paramMap.get('id?'));

    this.backendService.updateAssessment(form).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
       this.notificationService.showSuccessNotification("Fiche d'évaluation Mise à jour");
       this.router.navigate(['/']);

       this.internshipRatingNoteForm.reset();
       this.traineeSkillEvalForm.reset();
       this.traineeKnowledgeForm.reset();
       this.traineeGlobalEvalForm.reset();
       this.supervisorForm.reset();
     });
   } else {
     const dialogRef = this.dialog.open(AssociateFormDialogComponent, {
       minWidth: '300px',
       data : form
     });

     dialogRef.afterClosed().subscribe((value: AssessmentForm) => {
       form.internshipGeneratedCode = value.internshipGeneratedCode;

       if (form.internshipRatingNote === ""){
         delete form.internshipRatingNote;
       }

       if (this.isObjectEmpty(form.traineeSkillEval)){
         delete form.traineeSkillEval;
       }

       if (this.isObjectEmpty(form.traineeKnowledge)){
         delete form.traineeKnowledge;
       }

       if (this.isObjectEmpty(form.traineeGlobalEval)){
         delete form.traineeGlobalEval;
       }
       this.backendService.createAssessmentForm(form).pipe(takeUntilDestroyed(this.destroyRef)).subscribe( res => {
         this.notificationService.showSuccessNotification("Fiche d'évaluation créee");
         //this.studentInfoForm.reset()
         this.internshipRatingNoteForm.reset()
         this.traineeSkillEvalForm.reset()
         this.traineeKnowledgeForm.reset()
         this.traineeGlobalEvalForm.reset()
         this.supervisorForm.reset()
       });
     })
   }
  }

//----------------------------------------------------------------------------
  private filterStudents(value: string | Partial<{ permanentCode: string | null; firstname: string | null; lastname: string | null; }>) {
    let filterValue: string | undefined = undefined

    if (typeof value === "string") {
      filterValue = value.toLowerCase();
    }

    return this.backendService.getStudents(<string>filterValue).pipe(
      tap(students => console.log(students)),
    );
  }

  private isObjectEmpty(obj: any){
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] !== '') {
          return false;
        }
      }
    }
    return true;
  }

  onOptionSelected(data: any) {
  }
}
