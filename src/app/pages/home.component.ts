import {Component, DestroyRef, effect, inject, LOCALE_ID, OnInit, signal} from "@angular/core";
import {AssessmentForm} from "../models/entities/assessmentForm.model";
import {BackendService} from "../services/backend.service";
import options from "../utils";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-landing-page',
  template: `
    <section class="main">
      <div *ngIf="!backendService.authenticated().state ; else assessmentList">
        <h1 class="mat-display-4">{{'Intern evaluation sheet' | translate}}</h1>
        <img src="https://www.destinationuniversites.ca/wp-content/uploads/uqac.png" alt="image">
      </div>

      <div class="flex flex-col items-center justify-center p-4">

        <ng-template #assessmentList>
          <div class="flex flex-row bg-gray-100 mb-4">
            <div class="custom-container">
              <h3 style="color: #47597f" class="block text-gray-700 text-3xl font-bold mb-2 p-2">{{'My scorecards' | translate}}</h3>
              <mat-divider></mat-divider>
              <div class="border-t border-gray-300 my-2 "></div>
              <div>
                  <div class="scroll-container flex overflow-x-auto pb-4">
                  <div *ngFor="let item of myAssessments()" class="item">
                    <app-assessment-template [assessment]="item"></app-assessment-template>
                  </div>
                  </div>
              </div>
            </div>
          </div>

          <div *ngIf="isHeadMaster" class="flex flex-row bg-gray-100 mb-4">
            <div class="custom-container">
              <h3 style="color: #47597f" class="block text-gray-700 text-3xl font-bold mb-2 p-2">{{'Other ongoing scorecards' | translate}}</h3>
              <mat-divider></mat-divider>
              <div class="border-t border-gray-300 my-2 "></div>
              <div >
                <div *ngIf="assessmentsIncomplete().length > 0">
                  <!--<h1>Autres fiches d'évaluation en cours</h1>-->
                    <div class="scroll-container flex overflow-x-auto pb-4">
                    <div *ngFor="let item of assessmentsIncomplete()" class="item">
                      <app-assessment-template [assessment]="item"></app-assessment-template>
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>

            <div *ngIf="isHeadMaster" class="flex flex-row bg-gray-100 mb-4">
              <div class="custom-container">
                <h3 style="color: #47597f" class="block text-gray-700 text-3xl font-bold mb-2 p-2">{{'Other completed scorecards' | translate}}</h3>
                <mat-divider></mat-divider>
                <div class="border-t border-gray-300 my-2 "></div>
                <div *ngIf="assessmentsCompleted().length > 0">
                  <!--<h1>Autres fiches d'évaluation complétées</h1>-->
                    <div class="scroll-container flex overflow-x-auto pb-4">
                      <div *ngFor="let item of assessmentsCompleted()" class="item">
                      <app-assessment-template [assessment]="item"></app-assessment-template>
                    </div>
                    </div>
                </div>
              </div>
            </div>


        </ng-template>
      </div>

    </section>
  `,
  styles: [`
    .custom-container {
      width: 90rem;
      height: 15rem;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 0.25rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      padding: 0.75rem;
    }

    .scroll-container {
      display: flex;
      overflow-x: auto;
      flex-wrap: nowrap;
        padding-bottom: 4px;
        }
    .main {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      /*align-items: center;*/
      /*text-align: center;*/
    }

    .main h1 {
    font-size: 3rem;
  }

  .horizontal-list {
    /*display: flex;*/
  }

  .item {
    margin-right: 25px;
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .text-primary-700 {
    color: #1a237e;
  }

  .text-gray-600 {
    color: #757575;
  }

  .text-blue-950 {
    color: #1565c0;
  }

  .text-red-600 {
    color: #e53935;
  }

  .bg-gray-100 {
    background-color: #f5f5f5;
  }

  .bg-white {
    background-color: #ffffff;
  }

  .bg-green-200 {
    background-color: #c8e6c9;
  }

  .bg-yellow-200 {
    background-color: #fff9c4;
  }

  .border {
    border-width: 1px;
    border-color: #e0e0e0;
  }

  .rounded-md {
    border-radius: 0.25rem;
  }

  .shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .p-2 {
    padding: 0.5rem;
  }

  .p-3 {
    padding: 0.75rem;
  }

  .mb-2 {
    margin-bottom: 0.5rem;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .my-2 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .flex-row {
    flex-direction: row;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .flex-auto {
    flex: 1 1 auto;
  }

  .flex-none {
    flex: none;
  }

  .flex-1 {
    flex: 1;
  }

  .text-3xl {
    font-size: 1.875rem;
  }

  .text-base {
    font-size: 1rem;
  }

  .font-bold {
    font-weight: 700;
  }

  .text-center {
    text-align: center;
  }
`],
  providers: [{provide: LOCALE_ID, useValue: 'en-US'}]
})
export class HomeComponent implements OnInit {
  image = signal<string | ArrayBuffer | null>(null);
  backendService = inject(BackendService);
  assessmentsIncomplete = signal<AssessmentForm[]>([]);
  assessmentsCompleted = signal<AssessmentForm[]>([]);
  myAssessments = signal<AssessmentForm[]>([]);
  userInfo = this.backendService.getAuthenticatedUser();
  isHeadMaster!: boolean;
  destroyRef = inject(DestroyRef)

  constructor() {
    effect(() => {
      if (this.userInfo().state) {
        this.backendService.getAssessments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
          if (this.userInfo().state && (this.backendService.getUserFromLocal()[0] as any).role === "Professor") {
            this.myAssessments.set(data.filter(value => value.supervisor.code === this.userInfo().value.code))

          } else if (this.userInfo().state && (this.backendService.getUserFromLocal()[0] as any).role === "Headmaster") {
            this.assessmentsIncomplete.set(data.filter(value => value.supervisor.code !== this.userInfo().value.code && !options.formIsCompleted(value)))
            this.assessmentsCompleted.set(data.filter(value => value.supervisor.code !== this.userInfo().value.code && options.formIsCompleted(value)))
            this.myAssessments.set(data.filter(value => value.supervisor.code === this.userInfo().value.code))
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

  uploadImageEvent($event: Event): void {
    const file = ($event.target as HTMLInputElement).files?.item(0);
    const imageFormData = new FormData();
    const fileReader = new FileReader();

    if (file) {
      imageFormData.append('image', file!, file?.name);
      fileReader.readAsDataURL(file);
      fileReader.onload = ($) => {
        this.image.set(fileReader.result);
      }
    }
  }
}
