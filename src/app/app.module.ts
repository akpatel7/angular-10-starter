import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';


import { AppComponent } from './app.component';
import { LogTestComponent } from './log-test/log-test.component';
import { LogService } from "./shared/log.service";
import { LogPublishersService } from "./shared/log-publishers.service";

import { CalculatorComponent } from './calculator/calculator.component';

@NgModule({
  declarations: [AppComponent, CalculatorComponent, LogTestComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [LogService, LogPublishersService],
  bootstrap: [AppComponent]
})
export class AppModule {}
