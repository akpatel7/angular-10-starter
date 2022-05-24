import {ErrorHandler, Injectable} from '@angular/core';
import * as StackTrace from 'stacktrace-js';
import { NGXLogger } from 'ngx-logger';
// import { LogService } from '../../../shared/services/log/log.service';

@Injectable()
export class CustomErrorHandlerService extends ErrorHandler {

    constructor(private logger: NGXLogger) {
        super();
    }

    public async handleError(error: any) {
      let errorMessage = '', stackFrameDetail, reportObject;

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
        else
        {
          // client-side error
          await StackTrace.fromError(error).then((stackframes) => {
            stackFrameDetail = [];
            for(let sf of stackframes) {
              const {
                functionName,
                args,
                fileName,
                lineNumber,
                columnNumber,
                source,
                isEval,
                isNative
              } = sf;
              stackFrameDetail.push({
                  functionName,
                  args,
                  fileName,
                  lineNumber,
                  columnNumber,
                  source,
                  isEval,
                  isNative
                });
            }
          });
          reportObject = {
            name: error.name,
            message: errorMessage || error.message,
            stack: stackFrameDetail, // || error.stack,
            url: 'location.href',
            route: 'router.url',
          };
          this.logger.error(reportObject);
        }
      }
      catch(err) {
        console.error('FATAL ERROR in error handler: ', err);
        this.handleError(err);
      }
      finally{
        super.handleError(error);
      }
    }
}

/* window onerror version */
/* https://stackoverflow.com/questions/34001666/how-do-i-get-a-simple-stacktrace-js-example-working
 window.onerror = function(msg, file, line, col, error) {
  StackTrace.fromError(error).then(callback).catch(errback);
}
var errback = function(err) { console.log(err.message);
};
var callback = function(stackframes) {
    var stringifiedStack = stackframes.map(function(sf) {
      return sf.toString();
    }).join('\n');  };
function fault() {

alert('Error will be invoked!')
  throw "Test Error"
};

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/stacktrace.js/2.0.0/stacktrace.js"></script>

 */
