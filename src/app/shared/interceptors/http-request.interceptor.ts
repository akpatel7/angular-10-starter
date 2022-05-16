import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor (private logger: NGXLogger, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const newReq = req.clone({
      headers: req.headers.set('Content-Type', 'application/json'),
      withCredentials: true
    });
    return next.handle(newReq)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let displayError = '';
          let serverError = '';
          let clientError = '';

          if (error.error instanceof ErrorEvent) {
            // client-side error
            clientError = `Error: ${error.error.message}`;
            this.logger.error(clientError);
          } else {
            // server-side error
            displayError = error.error;
            serverError = `Error Code: ${error.status}\n${error.message}\n${error.error}`;

            if (error.status === 401) {
              this.logger.error(serverError);
              this.router.navigate(['/unauthorized', { message: error.error}]);
            }

            if (error.status >= 500) {
              this.logger.error(serverError);
              this.router.navigate(['/error']);
            }
          }
          return throwError(displayError);
        })
     );
  }
}
 /*********************************//*
 ref: https://stackoverflow.com/questions/57350770/how-to-log-all-possible-console-errors-occurring-in-angular-application-on-a-cli

 HttpInterceptors are very powerful. This one does the following:

1. Adds a Content-Type to the header of every request, setting it to application/json
2. Sends each request with credentials
3. Retries each request a second time before error handling
4. Handles errors
-When the User is Unauthorized, it redirects to a custom 401 error page
-When the Server throws an Error (500+), it redirects to a custom server error page
-In all cases, it logs the error using the logging service mentioned above
-It also throws the error back to the caller, so if your API returns user-friendly error messages you can catch them in your controller and show them to your users

To register an HttpInterceptor in your application you need a module:
*/
