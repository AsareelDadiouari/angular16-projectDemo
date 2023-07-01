import {Component, effect, Inject, inject, OnInit, Optional} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthenticationComponent} from "../../pages/authentication.component";
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-auth-dialog',
  template: `
    <section class=".container">
      <app-login></app-login>
    </section>
  `,
  styles : [`
    .container {
    }
  `]
})
export class AuthenticationDialogComponent implements OnInit{
  @Optional() dialogRef = inject(MatDialogRef<AuthenticationComponent>)
  @Inject(MAT_DIALOG_DATA) data : any
  backendService = inject(BackendService)

  constructor() {
    effect(() => {
      if (this.backendService.authenticated().state){
        this.dialogRef.close();
      }
    });
  }

  ngOnInit(): void {
  }
}
