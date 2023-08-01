import {Component, effect, EventEmitter, Inject, inject, OnInit, Optional, Output} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthenticationComponent} from "../../pages/authentication.component";
import {BackendService} from "../../services/backend.service";
import {AssessmentForm} from "../../models/entities/assessmentForm.model";
import {AssociateForm} from "../../pages/associate-form";

@Component({
  selector: 'app-associate-form-dialog',
  template: `
    <section class=".container">
      <app-associate-form (submitClicked)="submitClicked($event)" [dataFromDialog]="data"></app-associate-form>
    </section>
  `,
  styles : [`
    .container {
    }
  `]
})
export class AssociateFormDialogComponent implements OnInit{
  @Optional() dialogRef = inject(MatDialogRef<AssociateFormDialogComponent>)
  backendService = inject(BackendService)

  constructor(@Inject(MAT_DIALOG_DATA) public data : AssessmentForm | undefined) {
    effect(() => {
      if (!this.backendService.authenticated().state){
        //this.dialogRef.close();
      }
    });
  }

  ngOnInit(): void {
  }

  submitClicked(data : AssessmentForm){
    this.dialogRef.close(data);
  }
}
