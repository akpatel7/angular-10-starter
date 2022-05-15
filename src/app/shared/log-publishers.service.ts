import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { LogPublisher, LogConsole, LogLocalStorage, LogWebApi } from "./log-publishers";

// *************************
// Publisher Configuration
// ************************
// import * as PUBLISHERS_CONFIG from "./log-publishers";
// const PUBLISHERS_FILE = "/src/app/assets/log-publishers.json";
const PUBLISHERS_CONFIG = [
  {
    "loggerName": "console",
    "loggerLocation": "",
    "isActive":  true
  },
  {
    "loggerName": "localstorage",
    "loggerLocation": "logging",
    "isActive": true
  },
  {
    "loggerName": "webapi",
    "loggerLocation": "/api/log",
    "isActive": false
  }
];

// ****************************************************
// Log Publisher Config Definition Class
// ****************************************************
class LogPublisherConfig {
  loggerName!: string;
  loggerLocation!: string;
  isActive!: boolean;
}

// ****************************************************
// Logging Publishers Service Class
// ****************************************************
@Injectable({
  providedIn: 'root',
})
export class LogPublishersService {
  constructor(private http: HttpClient) {
    // Build publishers arrays
    this.buildPublishers();
  }

  // Public properties
  publishers: LogPublisher[] = [];

  // *************************
  // Public methods
  // *************************
  // Build publishers array
  buildPublishers(): void {
    let logPub: LogPublisher;

    // this.getLoggers().subscribe(response => {
    //   for (let pub of response.filter(p => p.isActive)) {
    //     switch (pub.loggerName.toLowerCase()) {
    //       case "console":
    //         logPub = new LogConsole();
    //         break;
    //       case "localstorage":
    //         logPub = new LogLocalStorage();
    //         break;
    //       case "webapi":
    //         logPub = new LogWebApi(this.http);
    //         break;
    //     }
    //     // Set location of logging
    //     logPub.location = pub.loggerLocation;
    //     // Add publisher to array
    //     this.publishers.push(logPub);
    //   }
    // });
    const loggers = this.getLoggers().filter(p => p.isActive);
    for (let pub of loggers) {
      switch (pub.loggerName.toLowerCase()) {
        case "console":
          logPub = new LogConsole();
          logPub.location = pub.loggerLocation;
          this.publishers.push(logPub);
          break;
        case "localstorage":
          logPub = new LogLocalStorage();
          logPub.location = pub.loggerLocation;
          this.publishers.push(logPub);
          break;
        case "webapi":
          logPub = new LogWebApi(this.http);
          logPub.location = pub.loggerLocation;
          this.publishers.push(logPub);
          break;
      }
    }
  }

  // Get logger configuration info from JSON file
  // getLoggers(): Observable<LogPublisherConfig[]> {
  //   return this.http.get<LogPublisherConfig>(PUBLISHERS_FILE)
  //     .pipe(
  //       map((response: any) => response.json()),
  //       catchError(this.handleErrors)
  //     );
  // }
  // Get logger configuration info from JSON file
  getLoggers(): LogPublisherConfig[] {
    try {
      const loggers = PUBLISHERS_CONFIG;
      return <LogPublisherConfig[]>loggers;
    }
    catch (e) {
      throw this.handleErrors(e);
    }
  }


  // *************************
  // Private methods
  // *************************
  private handleErrors(error: any): Observable<any> {
    let errors: string[] = [];
    let msg: string = "";

    msg = "Status: " + error.status;
    msg += " - Status Text: " + error.statusText;
    if (error) {
      // msg += " - Exception Message: " + error.json().exceptionMessage;
      msg += " - Exception Message: " + error.exceptionMessage;
    }
    errors.push(msg);

    console.error('An error occurred', errors);

    return throwError(errors);
  }
}
