import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {CommonModule, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {CastPipe} from "./pipes/cast.pipe";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {RouterOutlet} from "@angular/router";
import {HomeComponent} from "./pages/home.component";
import {AppRoutingModule} from "./app.routing.module";
import {SafeHTMLPipe} from "./pipes/safeHTML.pipe";
import {SafeBASE64Pipe} from "./pipes/safeBASE64.pipe";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { HeaderComponent } from './components/header.component';
import {AssessmentFormComponent} from "./pages/assessment-form.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatStepperModule} from "@angular/material/stepper";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AuthenticationComponent} from "./pages/authentication.component";
import {MatTabsModule} from "@angular/material/tabs";
import {AuthenticationDialogComponent} from "./components/dialogs/authentication-dialog.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {environment} from "../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AuthInterceptor} from "./auth.interceptor";
import {SpinnerComponent} from "./components/spinner.component";
import {AssociateForm} from "./pages/associate-form";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AssessmentTemplateComponent} from "./components/assessment-template.component";
import {MatCardModule} from "@angular/material/card";
import {AssociateFormDialogComponent} from "./components/dialogs/associate-form-dialog.component";
import {AssessmentFormInfoComponent} from "./components/dialogs/assessment-form-info.component";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    AssessmentFormComponent,
    AuthenticationComponent,
    AuthenticationDialogComponent,
    AssessmentTemplateComponent,
    AssociateFormDialogComponent,
    AssessmentFormInfoComponent,
    SpinnerComponent,
    AssociateForm,
    CastPipe,
    SafeHTMLPipe,
    SafeBASE64Pipe,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgOptimizedImage,
    NgTemplateOutlet,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    RouterOutlet,
    AppRoutingModule,
    HttpClientModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatCardModule,
    MatTooltipModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
