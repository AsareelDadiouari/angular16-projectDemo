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
import {HttpClientModule} from "@angular/common/http";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { HeaderComponent } from './components/header/header.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    AssessmentFormComponent,
    AuthenticationComponent,
    AuthenticationDialogComponent,
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
    RouterOutlet,
    AppRoutingModule,
    HttpClientModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatProgressSpinnerModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'en' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
