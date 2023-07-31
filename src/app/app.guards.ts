import {BackendService} from "./services/backend.service";
import {DestroyRef, effect, inject, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {AuthenticationDialogComponent} from "./components/dialogs/authentication-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {catchError, map, Observable, of} from "rxjs";
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(BackendService);
  const router = inject(Router);
  const dialog = inject(MatDialog);
  const destroyRef = inject(DestroyRef)

  toObservable(authService.authenticated)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(val => {
    if (!val.state)
      router.navigate(['/']).then(() => {
        console.log(route)
        console.log(state)
        //displayAuthModal(router, dialog)
      })
  });

  return toObservable(authService.authenticated).pipe(
    map((val) => {
      if (!val.state){
        router.navigate(['/']).then(() => displayAuthModal(router, dialog))
      }

      return val.state as boolean;
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};

function displayAuthModal(router: Router, dialog: MatDialog){
  const dialogRef = dialog.open(AuthenticationDialogComponent, {
    //height: '40%',
    width: '300px',
  });
  if (dialogRef === null)
    router.navigate(['/auth']).then(() => alert("Failed to open dialog"))
}
