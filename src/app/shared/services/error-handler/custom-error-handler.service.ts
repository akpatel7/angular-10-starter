import {ErrorHandler, Injectable} from '@angular/core';
// import { NGXLogger } from 'ngx-logger';
import { LogService } from '../../../shared/services/log/log.service';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class CustomErrorHandlerService extends ErrorHandler {

    constructor(private logger: LogService) {
        super();
    }

    public handleError(error: any) {
      const message = error.message ? error.message : error.toString();

      if (error.status) {
        error = new Error(message);
      }

      StackTrace.fromError(error).then((stackframes) => {
        const stackString = stackframes
          .splice(0, 10)
          .map(function(sf) {
            return sf.toString();
          })
          .toString();

      const errorTraceStr = `Error message: ${message}. Stack trace: ${stackString}`;

      this.logger.error(errorTraceStr);

      // throw error;
      });

      super.handleError(error);

      // Here you can provide whatever logging you want
      // this.logger.error(error);
      // super.handleError(error);
    }
}
