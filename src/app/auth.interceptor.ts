import {forwardRef, Inject, inject, Injectable, Injector} from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, switchMap, take} from "rxjs";
import {BackendService} from "./services/backend.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const fbAuth = this.injector.get(AngularFireAuth)

    return fbAuth.idToken.pipe(
      take(1),
      switchMap((token: any) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            withCredentials: true,
          });
        }
        return next.handle(request);
      })
    );
  }
}
