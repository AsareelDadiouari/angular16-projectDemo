import {AfterContentInit, Component, computed, effect, inject, LOCALE_ID, OnInit, Signal, signal} from "@angular/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {AssessmentForm} from "../models/assessmentForm.model";
import {BackendService} from "../services/backend.service";
import {map, tap} from "rxjs";
import {Supervisor} from "../models/supervisor.model";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-landing-page',
  template: `
    <section class="main">
      <div *ngIf="myAssessments()?.length === 0
       && assessmentsCompleted().length === 0
       && assessmentsIncomplete().length === 0; else assessmentList">
        <h1 class="mat-display-4">Fiche d'evaluation Stagiaire</h1>
        <img src="https://www.destinationuniversites.ca/wp-content/uploads/uqac.png" alt="image">
      </div>

      <ng-template #assessmentList>
        <div>
          <h1>Mes fiches d'évaluation</h1>
          <div class="horizontal-list">
            <div *ngFor="let item of myAssessments()" class="item">
              <app-assessment-template [assessment]="item"></app-assessment-template>
            </div>
          </div>
        </div>

        <div *ngIf="isHeadMaster">
          <div *ngIf="assessmentsIncomplete().length > 0">
            <h1>Autres fiches d'évaluation en cours</h1>
            <div class="horizontal-list">
              <div *ngFor="let item of assessmentsIncomplete()" class="item">
                <app-assessment-template [assessment]="item"></app-assessment-template>
              </div>
            </div>
          </div>

          <div *ngIf="assessmentsCompleted().length > 0">
            <h1>Autres fiches d'évaluation complétées</h1>
            <div class="horizontal-list">
              <div *ngFor="let item of assessmentsCompleted()" class="item">
                <app-assessment-template [assessment]="item"></app-assessment-template>
              </div>
            </div>
          </div>

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
    .horizontal-list {
      display: flex;
    }

    .item {
      margin-right: 10px;
      padding-top: 50px;
      padding-bottom: 50px;
    }
  `],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }]
})
export class HomeComponent implements OnInit{
  image = signal<string | ArrayBuffer | null>(null);
  backendService = inject(BackendService);
  assessmentsIncomplete = signal<AssessmentForm[]>([]);
  assessmentsCompleted = signal<AssessmentForm[]>([]);
  myAssessments = signal<AssessmentForm[]>([]);
  userInfo = this.backendService.getAuthenticatedUser();
  isHeadMaster!: boolean;

  constructor() {
    effect(() => {
      if (this.userInfo().state){
        this.backendService.getAssessments().subscribe(data => {
          if (this.userInfo().state && (this.backendService.getUserFromLocal()[0] as any).role === "Professor"){
            this.myAssessments.set(data.filter(value => value.supervisor.code ===  this.userInfo().value.code ))

          } else if (this.userInfo().state && (this.backendService.getUserFromLocal()[0] as any).role === "Headmaster"){
            this.assessmentsIncomplete.set(data.filter(value => value.supervisor.code !==  this.userInfo().value.code && !this.formIsCompleted(value)))
            this.assessmentsCompleted.set(data.filter(value => value.supervisor.code !==  this.userInfo().value.code && this.formIsCompleted(value)))
            this.myAssessments.set(data.filter(value => value.supervisor.code ===  this.userInfo().value.code ))
          }

          this.isHeadMaster = (this.backendService.getUserFromLocal()[0] as any).role === "Headmaster";
        })
      } else {
        this.assessmentsIncomplete = signal<AssessmentForm[]>([]);
        this.assessmentsCompleted = signal<AssessmentForm[]>([]);
        this.myAssessments = signal<AssessmentForm[]>([]);
      }
    })
  }

  ngOnInit() {
  }

  private formIsCompleted(value: AssessmentForm) : boolean {
    return !(value.internshipRatingNote === undefined ||
      value.traineeSkillEval === undefined ||
      value.traineeKnowledge === undefined ||
      value.traineeGlobalEval === undefined);
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
