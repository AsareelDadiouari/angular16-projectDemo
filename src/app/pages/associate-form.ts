import {Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {toSignal} from "@angular/core/rxjs-interop";
import {Intern} from "../models/intern";
import {switchMap, tap} from "rxjs";
import {BackendService} from "../services/backend.service";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {TranslateService} from "@ngx-translate/core";
import {LocalizationService} from "../services/localization.service";
import {AssessmentForm} from "../models/assessmentForm.model";
import {Professor} from "../models/professor.model";
import {Headmaster} from "../models/headmaster.model";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-associate-form',
  template: `
    <section>
      <h2 class="mat-display-2">Associate a student</h2>
      <form [formGroup]="associateForm">
        <div class="form-group">
          <mat-form-field appearance="outline">
            <mat-label for="permanentCode">Permanent Code :</mat-label>
            <input type="text" id="permanentCode" formControlName="permanentCode" [matAutocomplete]="auto" matInput>
            <mat-autocomplete #matAutocompleteStudentCode (optionSelected)="onOptionSelected($event)"
                              #auto="matAutocomplete">

              <div *ngIf="dataFromDialog; else normal">
                <mat-option [value]="dataFromDialog.studentIntern.code">
                  {{dataFromDialog.studentIntern.code}}
                </mat-option>
              </div>
              <ng-template #normal>
                <mat-option *ngFor="let student of students()" [value]="student.code">
                  {{student.code}}
                </mat-option>
              </ng-template>

            </mat-autocomplete>
          </mat-form-field>
        </div>

        <div class="form-group">
          <div class="horizontal-container">
            <mat-form-field appearance="outline">
              <mat-label for="professorFullname">Professor</mat-label>
              <input type="text" id="professorFullname" formControlName="professorFullname" matInput>
            </mat-form-field>
            <button class="submit-button" mat-raised-button
                    [color]="this.associateForm.controls.professorFullname.enabled ?'warn' : 'primary'"
                    (click)="onButtonChange()">
              {{this.associateForm.controls.professorFullname.enabled ? "Disable" : "Enable" }}
            </button>
          </div>
        </div>

        <mat-form-field>
          <mat-label>Year</mat-label>
          <mat-select formControlName="internshipNumber" appearance="outline">
            <mat-option #YearMatSelect *ngFor="let year of years" [value]="year">{{year}}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Term</mat-label>
          <mat-select formControlName="internshipTerm" appearance="outline">
            <mat-option *ngFor="let term of terms" [value]="term">{{term}}</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
      <button [disabled]="associateForm.invalid" class="submit-button" mat-raised-button color="primary"
              (click)="submitForm()">Submit
      </button>
    </section>

  `,
  styles: [`
    section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    mat-form-field {
      width: 100%;
    }

    mat-select {
      width: 100%;
    }

    .horizontal-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .horizontal-container input {
      margin-right: 10px;
    }
  `]
})
export class AssociateForm implements OnInit{
  fb = inject(FormBuilder)
  backendService = inject(BackendService);
  localizationService = inject(LocalizationService);
  notificationService = inject(NotificationService);
  userInfo = this.backendService.getAuthenticatedUser();
  selectedStudent?: Intern;
  @ViewChild("matAutocompleteStudentCode") matAutocompleteStudentCode!: MatAutocomplete;
  @ViewChild("YearMatSelect") yearMatSelect!: MatOption;
  @Input() dataFromDialog!: AssessmentForm | undefined;
  @Output() submitClicked = new EventEmitter<any>();

  inputDisable = false;

  ngOnInit() {
    this.associateForm.controls.professorFullname.disable();
  }

  associateForm = this.fb.group({
    permanentCode : ['', Validators.required],
    professorFullname : [this.userInfo().value.firstname + " " + this.userInfo().value.lastname],
    internshipTerm : ['', Validators.required],
    internshipNumber : ['', Validators.required]
  })

  years: number[] = ((): number[] => {
    const currentYear = new Date().getFullYear();
    return Array.from({length: 21}, (_, i) => currentYear - 10 + i);
  })();

  terms: string[] = [
    this.localizationService.getLanguage() === "en" ? "Winter" : "Hiver",
    this.localizationService.getLanguage() === "en" ? "Summer" : "Ete",
    this.localizationService.getLanguage() === "en" ? "Fall" : "Automne"
  ];

  students = toSignal<Intern[]>(this.associateForm.controls['permanentCode'].valueChanges.pipe(
    switchMap((value) => {
      if (this.backendService.authenticated().state && value)
        return this.backendService.getStudents(value!.toUpperCase());
      return [];
    }),
    tap((value) => {
      this.matAutocompleteStudentCode.optionSelected.subscribe(() => {
          this.selectedStudent = value.find(val => val.code === this.associateForm.controls['permanentCode'].value);
        }
      )
    })
  ))

  onButtonChange(){
    if (this.associateForm.controls.professorFullname.enabled){
      this.inputDisable = true;
      this.associateForm.controls.professorFullname.disable();
    }
    else
    {
      this.inputDisable = false;
      this.associateForm.controls.professorFullname.enable();
    }
  }

  onOptionSelected($event: MatAutocompleteSelectedEvent) {

  }

  submitForm() {
   if (this.dataFromDialog){
     this.submitClicked.emit({
       internshipGeneratedCode : this.internCodeGeneration(),
     }as AssessmentForm);
   }else {
     this.backendService.createAssessmentForm({
       internshipGeneratedCode : this.internCodeGeneration(),
       studentIntern : this.selectedStudent,
       supervisor : (() => {
         const userData = localStorage.getItem('auth');
         if (userData) {
           try {
             const user = JSON.parse(userData);
             return user.user
           } catch (error) {
             console.error('Error parsing user data from local storage:', error);
           }
         }
       })()
     }as AssessmentForm).subscribe(result => {
       this.notificationService.showSuccessNotification("Etudiant associé avec succès");
       this.associateForm.controls.permanentCode.reset();
       this.associateForm.controls.internshipNumber.setValue("");
       this.associateForm.controls.internshipTerm.setValue("");
     })
   }
  }

  private internCodeGeneration(): string | undefined{
    return this.associateForm.controls.internshipNumber.value!.toString().slice(-2) +
      this.associateForm.controls.internshipTerm.value!.toUpperCase().slice(0, 3) +
      (Math.floor(Math.random() * (99 - 1 + 1)) + 1).toString().padStart(2, '0') +
      this.associateForm.controls.professorFullname.value!.split(' ').map(word => word.charAt(0)).join('') +
      this.associateForm.controls.permanentCode.value!.slice(0, 3);
  }
}
