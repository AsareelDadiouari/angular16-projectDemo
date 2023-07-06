import {AfterViewInit, Component, inject, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {toSignal} from "@angular/core/rxjs-interop";
import {Intern} from "../models/intern";
import {switchMap, tap} from "rxjs";
import {BackendService} from "../services/backend.service";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatCheckbox} from "@angular/material/checkbox";

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
              <mat-option *ngFor="let student of students()" [value]="student.code">
                {{student.code}}
              </mat-option>
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
          <mat-select formControlName="internshipTerm" appearance="outline">
            <ng-container>
              <mat-option *ngFor="let year of years">{{year}}</mat-option>
            </ng-container>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Term</mat-label>
          <mat-select formControlName="internshipTerm" appearance="outline">
            <mat-option>Winter</mat-option>
            <mat-option>Spring</mat-option>
            <mat-option>Fall</mat-option>
          </mat-select>
        </mat-form-field>
      </form>

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
  userInfo = this.backendService.getAuthenticatedUser();
  @ViewChild("matAutocompleteStudentCode") matAutocompleteStudentCode!: MatAutocomplete;
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
    const arr = []
    for (let i = 10; i >= 0; i--){
      arr.push(new Date().getFullYear() - i);
    }
    return arr;
  })();

  students = toSignal<Intern[]>(this.associateForm.controls['permanentCode'].valueChanges.pipe(
    switchMap((value) => {
      if (this.backendService.authenticated().state)
        return this.backendService.getStudents(value!.toUpperCase())
      return []
    }),
    tap((value) => {
      this.matAutocompleteStudentCode.optionSelected.subscribe(() => {
          const student = value.find(val => val.code === this.associateForm.controls['permanentCode'].value);
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
}
