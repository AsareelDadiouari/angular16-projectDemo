import {Component, computed, effect, inject, LOCALE_ID, OnInit, Signal, signal} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {AssessmentForm} from "../models/assessmentForm.model";
import {BackendService} from "../services/backend.service";
import {map, tap} from "rxjs";
import {Supervisor} from "../models/supervisor.model";

@Component({
  selector: 'app-landing-page',
  template: `
    <style>
      .main {
        min-height: 100vh;
      }
    </style>
    <section class="main">
      <div *ngIf="assessments()?.length === 0 || !assessments(); else assessmentList">
        <h1 class="mat-display-4">Fiche d'evaluation Stagiaire</h1>
        <img src="https://www.destinationuniversites.ca/wp-content/uploads/uqac.png" alt="image">
      </div>

      <ng-template #assessmentList>
        <div *ngFor="let item of assessments()">
          {{item?.internshipGeneratedCode}}
        </div>
      </ng-template>
    </section>
  `,
  styles : [`
    .main {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .main h1 {
      font-size: 3rem;
    }
  `],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }]
})
export class HomeComponent implements OnInit{
  image = signal<string | ArrayBuffer | null>(null);
  backendService = inject(BackendService);
  assessments = signal<AssessmentForm[]>([]);
  userInfo = this.backendService.getAuthenticatedUser();

  constructor() {
    effect(() => {
      if (this.userInfo().state){
        this.backendService.getAssessments().subscribe(data => {
          if (this.userInfo().state && (this.backendService.getUserFromLocal()[0] as any).role === "Professor"){
            this.assessments.set(data.filter(value => value.supervisor.code ===  this.userInfo().value.code))
          } else if (this.userInfo().state && (this.backendService.getUserFromLocal()[0] as any).role === "Headmaster"){
            this.assessments.set(data)
          }
        })
      } else {
        this.assessments = signal<AssessmentForm[]>([]);
      }
    })
  }

  ngOnInit(): void {
  }

  uploadImageEvent($event: Event): void {
    const file = ($event.target as HTMLInputElement).files?.item(0);
    const imageFormData = new FormData();
    const fileReader = new FileReader();

    if (file ){
      imageFormData.append('image', file!, file?.name);
      fileReader.readAsDataURL(file);
      fileReader.onload = ($) => {
        this.image.set(fileReader.result);
      }
    }
  }
}
