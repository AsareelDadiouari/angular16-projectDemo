import {Component, ElementRef, inject, ViewChild} from "@angular/core";
import {LocalizationService} from "../services/localization.service";
import {FormBuilder, Validators} from "@angular/forms";
import {BackendService} from "../services/backend.service";
import {Supervisor} from "../models/supervisor.model";
import {Professor} from "../models/professor.model";
import {Headmaster} from "../models/headmaster.model";
import {LoginModel} from "../models/login.model";
import {MatTabGroup} from "@angular/material/tabs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-login',
  template: `
    <mat-tab-group #Tab>
      <mat-tab class="login" [label]="localizationService.getLanguage() === 'en' ? 'Login' : 'Connexion'">
        <form class="login-form" [formGroup]="loginForm" (submit)="submitLoginForm()">
          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="loginForm.controls.email.invalid && loginForm.controls.email.touched">
                Please enter a valid email.
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" required>
              <mat-error *ngIf="loginForm.controls.password.invalid && loginForm.controls.password.touched">
                Please enter a password.
              </mat-error>
            </mat-form-field>
          </div>

          <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">Login</button>
        </form>

      </mat-tab>
      <mat-tab class="signUp" [label]="localizationService.getLanguage() === 'en' ? 'SignUp' : 'Inscription'">
        <form class="signup-form" [formGroup]="signUpForm" (submit)="submitSignUpForm()">
          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="signUpForm.controls.email.invalid && signUpForm.controls.email.touched">
                Please enter a valid email.
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" required>
              <mat-error *ngIf="signUpForm.controls.password.invalid && signUpForm.controls.password.touched">
                Please enter a password.
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input id="firstname" matInput formControlName="firstname" type="text" required>
              <mat-error *ngIf="signUpForm.controls.firstname.invalid && signUpForm.controls.firstname.touched">
                Please enter your first name.
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input id="lastname" matInput formControlName="lastname" type="text" required>
              <mat-error *ngIf="signUpForm.controls.lastname.invalid && signUpForm.controls.lastname.touched">
                Please enter your last name.
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="Professor">Professor</mat-option>
                <mat-option value="Admin">Admin</mat-option>
              </mat-select>
              <mat-error *ngIf="signUpForm.controls.role.invalid && signUpForm.controls.role.touched">
                Please select at least one role.
              </mat-error>
            </mat-form-field>
          </div>

          <button mat-raised-button color="primary" type="submit" [disabled]="signUpForm.invalid">Sign Up</button>
        </form>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    .form-group {
      margin-bottom: 20px;
    }

    .signup-form ,.login-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }

    mat-form-field {
      width: 100%;
    }

    button[type="submit"] {
      width: 100%;
      max-width: 200px;
    }
  `]
})
export class AuthenticationComponent {
  fb = inject(FormBuilder);
  @ViewChild('Tab') tabGroup!: MatTabGroup;

  backendService = inject(BackendService);
  localizationService = inject(LocalizationService);
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required, ],
  });

  signUpForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required, ],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    role: ['', Validators.required],
  });

  submitLoginForm() {
    this.backendService.login(this.loginForm.getRawValue() as LoginModel);
  }

  submitSignUpForm() {
    const supervisorData = this.signUpForm.getRawValue();

    if (supervisorData.role?.includes("Professeur")  || supervisorData.role?.includes("Professor") ){
      const supervisor: Professor = {
        code: '',
        email: supervisorData.email || '',
        firstname: supervisorData.firstname || '',
        lastname: supervisorData.lastname || '',
        password: supervisorData.password || '',
      };
      this.backendService.createSupervisor(new Professor({... supervisor}))
        .pipe(takeUntilDestroyed())
        .subscribe(() => {this.tabGroup.selectedIndex = 0});
    } else {
      this.backendService.createSupervisor({
        code: '',
        email: supervisorData.email || '',
        firstname: supervisorData.firstname || '',
        lastname: supervisorData.lastname || '',
        password: supervisorData.password
      } as Headmaster)
        .pipe(takeUntilDestroyed())
        .subscribe(() => {this.tabGroup.selectedIndex = 0});
    }
  }
}
