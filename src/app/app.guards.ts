import {CanActivateFn} from "@angular/router";
import {BackendService} from "./services/backend.service";
import {inject} from "@angular/core";

export function authenticationGuard(): CanActivateFn {
  return () => {
    const oauthService = inject(BackendService);
    return oauthService.isAuthenticated().state;
  };
}
