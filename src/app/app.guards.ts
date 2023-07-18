import {BackendService} from "./services/backend.service";
import {effect, inject} from "@angular/core";
import {Router, UrlTree} from "@angular/router";
import {AuthenticationDialogComponent} from "./components/dialogs/authentication-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";

export function authenticationGuard() {
  const router = inject(Router)
  const oauthService = inject(BackendService);
  return (() => {
    if(oauthService.authenticated().state)
      return true;

     displayAuthModal(router);
     return router.parseUrl("/");
  })()
}

function displayAuthModal(router: Router){
  const dialog = inject(MatDialog);

  const dialogRef = dialog.open(AuthenticationDialogComponent, {
    //height: '40%',
    width: '300px',
  });
  if (dialogRef === null)
    router.navigate(['/auth']).then(() => alert("Failed to open dialog"))
}
