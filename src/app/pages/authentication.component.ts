import {
  Component,
  ComponentFactoryResolver,
  ElementRef, EventEmitter,
  inject,
  Output,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import {LocalizationService} from "../services/localization.service";
import {FormBuilder, Validators} from "@angular/forms";
import {BackendService} from "../services/backend.service";
import {Supervisor} from "../models/entities/supervisor.model";
import {Professor} from "../models/entities/professor.model";
import {Headmaster} from "../models/entities/headmaster.model";
import {LoginModel} from "../models/entities/login.model";
import {MatTabGroup} from "@angular/material/tabs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-login',
  template: `
    <mat-tab-group #Tab>
      <mat-tab class="login" [label]="localizationService.currentLanguage() === 'en' ? 'Login' : 'Connexion'">
        <form class="login-form" [formGroup]="loginForm" (submit)="localLogin()">
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
          <a (click)="clickOnForgetPassword()" style="color: #1976d2; margin-top: 10px; cursor: pointer">Changer le mot de passe cliquez ici.</a>
        </form>

      </mat-tab>
      <mat-tab class="signUp" [label]="localizationService.currentLanguage() === 'en' ? 'SignUp' : 'Inscription'">
        <form class="signup-form" [formGroup]="signUpForm" (submit)="signUp()">
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
      <ng-container *ngIf="displayChangePasswordTab">
        <mat-tab [label]="localizationService.currentLanguage() === 'en' ? 'Forget Password' : 'Mot de passe'">
          <form class="newPassword-form" [formGroup]="changePasswordForm"  (submit)="submitNewPassword()">
            <div class="form-group">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" required>
                <mat-error
                  *ngIf="changePasswordForm.controls.email.invalid && changePasswordForm.controls.email.touched">
                  Please enter a valid email.
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-group">
              <mat-form-field appearance="outline">
                <mat-label>Current Password</mat-label>
                <input matInput formControlName="currentPassword" type="password" required>
                <mat-error
                  *ngIf="changePasswordForm.controls.currentPassword.invalid && changePasswordForm.controls.currentPassword.touched">
                  Please enter the current password.
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-group">
              <mat-form-field appearance="outline">
                <mat-label>New Password</mat-label>
                <input matInput formControlName="newPassword" type="password" required>
                <mat-error
                  *ngIf="changePasswordForm.controls.newPassword.invalid && changePasswordForm.controls.newPassword.touched">
                  Please enter a new password.
                </mat-error>
                <mat-error
                    *ngIf="changePasswordForm.controls.newPassword.invalid && changePasswordForm.controls.newPassword.errors!['minlength'] ">
                  A minimum of 6 characters
                </mat-error>
              </mat-form-field>
            </div>
            <button mat-raised-button color="primary" type="submit" [disabled]="changePasswordForm.invalid">Submit</button>
          </form>
        </mat-tab>
      </ng-container>
    </mat-tab-group>
  `,
  styles: [`
    .form-group {
      margin-bottom: 20px;
    }

    .signup-form ,.login-form, .newPassword-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }

    mat-form-field {
      width: inherit !important;
    }

    mat-select {
      width: inherit !important;
    }

    button[type="submit"] {
      width: 100%;
      max-width: 200px;
    }
  `]
})
export class AuthenticationComponent {
  fb = inject(FormBuilder);
  displayChangePasswordTab: boolean = false;
  @ViewChild('Tab') tabGroup!: MatTabGroup;
  @Output() tabIsExpanded = new EventEmitter<boolean>(this.displayChangePasswordTab);

  backendService = inject(BackendService);
  localizationService = inject(LocalizationService);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required, ],
  });

  signUpForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    role: ['', Validators.required],
  });

  changePasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    currentPassword: ['', Validators.required,],
    newPassword: ['',  [Validators.required, Validators.minLength(6)]],
  })

  localLogin() {
    this.backendService.firebaseLogin(this.loginForm.getRawValue() as LoginModel).subscribe((value => {
      localStorage.setItem("refreshToken", JSON.stringify(value?.user!.refreshToken));
    }));
  }

  signUp() {
    const supervisorData = this.signUpForm.getRawValue();

    if (supervisorData.role?.includes("Professeur")  || supervisorData.role?.includes("Professor") ){
      const supervisor: Professor = {
        code: '',
        email: supervisorData.email!.toLowerCase() || '',
        firstname: supervisorData.firstname || '',
        lastname: supervisorData.lastname || '',
        password: supervisorData.password || '',
      };
      this.backendService.createSupervisor(new Professor({... supervisor}))
        .subscribe(() => {this.tabGroup.selectedIndex = 0});
    } else {
      this.backendService.createSupervisor({
        code: '',
        email: supervisorData.email!.toLowerCase() || '',
        firstname: supervisorData.firstname || '',
        lastname: supervisorData.lastname || '',
        password: supervisorData.password
      } as Headmaster)
        .subscribe(() => {this.tabGroup.selectedIndex = 0});
    }
  }

  clickOnForgetPassword() {
    this.displayChangePasswordTab = true;
    this.tabIsExpanded.emit(this.displayChangePasswordTab);
    this.tabGroup.selectedIndex = 2;
  }

  submitNewPassword() {
    this.backendService.changePassword({
      email: this.changePasswordForm.controls.email.value?.toLowerCase(),
      ...this.changePasswordForm.getRawValue() as Pick<any, "currentPassword" | "newPassword">
    }).subscribe(value => {
      this.displayChangePasswordTab = false;
      this.tabIsExpanded.emit(this.displayChangePasswordTab);
      this.tabGroup.selectedIndex = 0;
    })
  }
}
