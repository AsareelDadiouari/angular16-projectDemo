import { Component, Inject, inject, Optional } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AssessmentForm } from "../../models/assessmentForm.model";

@Component({
  selector: 'app-assessment-form-info',
  template: `
    <div class="assessment-info" *ngIf="data">
      <h2>Assessment Form Info</h2>

      <div class="section">
        <h3><span>A.</span> Intern Info</h3>
        <div class="details">
          <p><strong>Permanent Code:</strong> {{ data.studentIntern.code }}</p>
          <p><strong>Firstname:</strong> {{ data.studentIntern.firstname }}</p>
          <p><strong>Lastname:</strong> {{ data.studentIntern.lastname }}</p>
        </div>
      </div>

      <div class="section">
        <h3><span>B.</span> How do you estimate the intern overall performance</h3>
        <div class="details">
          <p><strong>Selection:</strong> {{ data.internshipRatingNote }}</p>
        </div>
      </div>

      <div class="section">
        <h3>Evaluation of the trainee's skills and clothing</h3>
        <div class="details">
          <p><strong>Demonstrate autonomy:</strong> {{ data.traineeSkillEval?.autonomy }}</p>
          <p><strong>Capable of active listening:</strong> {{ data.traineeSkillEval?.activeListeningSkills }}
          </p>
          <p><strong>Demonstrates an ability to work in a
            team:</strong> {{ data.traineeSkillEval?.abilityToWork }}</p>
          <p><strong>Demonstrates a good spirit of social
            adaptation:</strong> {{ data.traineeSkillEval?.socialAdaptation }}</p>
          <p><strong>Demonstrates initiative:</strong> {{ data.traineeSkillEval?.initiative }}</p>
          <p><strong>Show imagination:</strong> {{ data.traineeSkillEval?.imagination }}</p>
          <p><strong>Demonstrates good analytical skills:</strong> {{ data.traineeSkillEval?.analyticalSkills }}
          </p>
          <p><strong>Demonstrates skill in oral communication:</strong> {{ data.traineeSkillEval?.oralSkills }}
          </p>
          <p><strong>Additional notes:</strong> {{ data.traineeSkillEval?.additionalInfo }}</p>
        </div>
      </div>

      <div class="section">
        <h3>Assessment of trainee knowledge</h3>
        <div class="details">
          <p><strong>Mastering written
            communication:</strong> {{ data.traineeKnowledge?.writtenCommunicationSkills }}</p>
          <p><strong>Knows his field of specialization
            well:</strong> {{ data.traineeKnowledge?.fieldOfSpecialization }}</p>
          <p><strong>Is able to assume the responsibilities related to his
            task:</strong> {{ data.traineeKnowledge?.assumeResponsibilities }}</p>
          <p><strong>Is able to produce the requested
            documents:</strong> {{ data.traineeKnowledge?.produceRequestedDocs }}</p>
          <p><strong>Is able to make recommendations:</strong> {{ data.traineeKnowledge?.makeRecommendations }}
          </p>
          <p><strong>Is able to popularize the
            terminology:</strong> {{ data.traineeKnowledge?.popularizeTerminology }}</p>
          <p><strong>Additional notes:</strong> {{ data.traineeKnowledge?.additionalInfo }}</p>
        </div>
      </div>

      <div class="section">
        <h3>Overall evaluation of the trainee</h3>
        <div class="details">
          <p><strong>Selection:</strong> {{ data.traineeGlobalEval?.rating }}</p>
          <p><strong>Additional notes:</strong> {{ data.traineeGlobalEval?.additionalInfo }}</p>
        </div>
      </div>

      <div class="section">
        <h3>Supervisor Identification</h3>
        <div class="details">
          <p><strong>Code:</strong> {{ data.supervisor.code }}</p>
          <p><strong>Email:</strong> {{ data.supervisor.email }}</p>
          <p><strong>Firstname:</strong> {{ data.supervisor.firstname }}</p>
          <p><strong>Lastname:</strong> {{ data.supervisor.lastname }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .assessment-info {
      background-color: #f5f5f5;
      border-radius: 10px;
      padding: 20px;
    }

    h2 {
      font-size: 24px;
      margin-bottom: 20px;
      text-align: center;
    }

    .section {
      margin-bottom: 30px;
    }

    h3 {
      font-size: 20px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }

    h3 span {
      margin-right: 5px;
      font-weight: bold;
    }

    .details p {
      margin-bottom: 5px;
    }

    strong {
      font-weight: bold;
    }
  `]
})
export class AssessmentFormInfoComponent {
  @Optional() dialogRef = inject(MatDialogRef<AssessmentFormInfoComponent>)

  constructor(@Inject(MAT_DIALOG_DATA) public data: AssessmentForm | undefined) {}
}
