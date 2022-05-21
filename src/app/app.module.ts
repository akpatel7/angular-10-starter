import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';


import { AppComponent } from './app.component';

import { LogService } from "./shared/services/log/log.service";
import { LogPublishersService } from "./shared/services/log/log-publishers.service";

import { CalculatorComponent } from './components/calculator/calculator.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import {CustomErrorHandlerService} from './shared/services/error-handler/custom-error-handler.service';
import { HttpInterceptorModule } from './shared/interceptors/http-interceptor.module';
import { LogTestComponent } from './components/log-test/log-test.component';

@NgModule({
  declarations: [AppComponent, CalculatorComponent, LogTestComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpInterceptorModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    }),
  ],
  providers: [
    LogService,
    LogPublishersService,
    {provide: ErrorHandler, useClass: CustomErrorHandlerService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
