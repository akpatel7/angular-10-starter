import {ErrorHandler, Injectable} from '@angular/core';
import { NGXLogger } from 'ngx-logger';
// import { LogService } from '../../../shared/services/log/log.service';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class CustomErrorHandlerService extends ErrorHandler {

    constructor(private logger: NGXLogger) {
        super();
    }

    public handleError(error: any) {
      const message = error.message ? error.message : error.toString();

      if (error.status) {
        error = new Error(message);
      }

      // StackTrace.fromError(error).then((stackframes) => {
      //   const stackString = stackframes
      //     .splice(0, 10)
      //     .map(function(sf) {
      //       return sf.toString();
      //     })
      //     .toString();


      StackTrace.get().then((stack) => {
        const stackString = stack;
          // .splice(0, 10)
          // .map(function(sf) {
          //   return sf.toString();
          // })
          // .toString();

        // const errorTraceStr = `Error message: ${message}. Stack trace: ${stackString}`;

        const errorTrace = {
          message,
          stack: stackString
        };
        console.log('errTrace:******************************');
        console.log(errorTrace);
        console.log('errorTraceend**************************')
        this.logger.error(errorTrace);
        // throw error;
      });
      // Here you can provide whatever logging you want
      // this.logger.error(error);
      super.handleError(error);
    }
}
