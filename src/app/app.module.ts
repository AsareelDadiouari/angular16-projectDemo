import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {CommonModule, NgIf, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {CastPipe} from "./pipes/cast.pipe";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {RouterOutlet} from "@angular/router";
import {HomeComponent} from "./pages/home.component";
import {AppRoutingModule} from "./app.routing.module";
import {SafeHTMLPipe} from "./pipes/safeHTML.pipe";
import {SafeBASE64Pipe} from "./pipes/safeBASE64.pipe";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CastPipe,
    SafeHTMLPipe,
    SafeBASE64Pipe
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
    RouterOutlet,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
