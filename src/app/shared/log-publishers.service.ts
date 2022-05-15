import { Injectable } from '@angular/core';
// import {HttpClient} from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { map, catchError } from 'rxjs/operators';

import { LogPublisher, LogConsole, LogLocalStorage, LogWebApi } from "./log-publishers";

const PUBLISHERS_FILE = "/src/app/assets/log-publishers.json";

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
@Injectable()
export class LogPublishersService {
  constructor(private http: Http) {
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

    this.getLoggers().subscribe(response => {
      for (let pub of response.filter(p => p.isActive)) {
        switch (pub.loggerName.toLowerCase()) {
          case "console":
            logPub = new LogConsole();
            break;
          case "localstorage":
            logPub = new LogLocalStorage();
            break;
          case "webapi":
            logPub = new LogWebApi(this.http);
            break;
        }
        // Set location of logging
        logPub.location = pub.loggerLocation;
        // Add publisher to array
        this.publishers.push(logPub);
      }
    });
  }

  // Get logger configuration info from JSON file
  getLoggers(): Observable<LogPublisherConfig[]> {
    return this.http.get(PUBLISHERS_FILE)
      .pipe(
        catchError(this.handleErrors),
        map((response: any) => response.json())
      );
  }

  // *************************
  // Private methods
  // *************************
  private handleErrors(error: any): Observable<any> {
    let errors: string[] = [];
    let msg: string = "";

    msg = "Status: " + error.status;
    msg += " - Status Text: " + error.statusText;
    if (error.json()) {
      msg += " - Exception Message: " + error.json().exceptionMessage;
    }
    errors.push(msg);

    console.error('An error occurred', errors);

    return Observable.throw(errors);
  }
}
