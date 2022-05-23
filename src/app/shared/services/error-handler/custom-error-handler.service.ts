import {ErrorHandler, Injectable} from '@angular/core';
import * as StackTrace from 'stacktrace-js';
import { NGXLogger } from 'ngx-logger';
// import { LogService } from '../../../shared/services/log/log.service';


// const errback = (err: { message: any; }) => {
//   console.error('window.onerror: ' + err.message);
// }

// const callback = (stackframes: any[]) => {
//       let stringifiedStack = stackframes.map(function(sf: { toString: () => any; }) {
//         return sf.toString();
//       }).join('\n');
//     console.error('window.onerror: ' + stringifiedStack);
//}
@Injectable()
export class CustomErrorHandlerService extends ErrorHandler {

    constructor(private logger: NGXLogger) {
        super();
    }

  // constructor(
  //   private logger: NGXLogger, private window: Window) {
  //   // window.onerror = function(msg, file, line, col, error ) {
  //   //   if (error) {
  //   //     StackTrace.fromError(error).then(callback).catch(errback);
  //   //   }
  //   // }
  //   super();
  // }

    public async handleError(error: any) {
      let errorMessage = '', stackTrace, reportObject;

      errorMessage = error?.error?.message ? error?.message : error?.toString() || '';

      try {
        if(error.status)
        {
          // server-side error
          reportObject = {
            status: error.status,
            name: error.name,
            message: errorMessage || error.message,
            httpErrorCode: error.httpErrorCode,
            url: 'location.href',
            route: 'router.url',
          };
          this.logger.error(reportObject);
        }
        else {
          // client-side error
          await StackTrace.fromError(error).then((stackframes) => {
            stackTrace = stackframes
              .splice(0, 10)
              .map(function(sf) {
                return sf.toString();
              });
              //.toString();

          // StackTrace.get().then((stack) => {
          //   const stackString = stack;
              // .splice(0, 10)
              // .map(function(sf) {
              //   return sf.toString();
              // })
              // .toString();

            // const errorTraceStr = `Error message: ${message}. Stack trace: ${stackString}`;
          });
          reportObject = {
            name: error.name,
            message: errorMessage || error.message,
            stack: stackTrace || error.stack,
            url: 'location.href',
            route: 'router.url',
          };
          this.logger.error(reportObject);
        }
      }
      catch(err) {
        console.error('FATAL ERROR in error handler: ', err);
        throw err;
      }
      finally {
        super.handleError(error);
      }
    }
}
