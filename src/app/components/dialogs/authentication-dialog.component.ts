import {Component, Inject, inject, Optional} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthenticationComponent} from "../../pages/authentication.component";

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
export class AuthenticationDialogComponent {
  @Optional() dialogRef = inject(MatDialogRef<AuthenticationComponent>)
  @Inject(MAT_DIALOG_DATA) data : any
}
