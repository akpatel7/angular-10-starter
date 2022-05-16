import {ErrorHandler, Injectable} from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class CustomErrorHandlerService extends ErrorHandler {

    constructor(private logger: NGXLogger) {
        super();
    }

    handleError(error: any) {
        // Here you can provide whatever logging you want
        this.logger.error(error);
        super.handleError(error);
    }
}
