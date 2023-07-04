import {inject, Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, switchMap, take} from "rxjs";
import {BackendService} from "./services/backend.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  backend = inject(BackendService);
  constructor() {
    this.backend.fbAuth.user.subscribe(test => console.log(test))
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.backend.fbAuth.idToken.pipe(
      take(1),
      switchMap((token: any) => {
        if (token) {
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
        }
        alert("bruh")
        return next.handle(request);
      })
    );
  }
}
