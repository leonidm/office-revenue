import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalculationService } from './services/calculation.service';
import { CsvService } from './services/csv.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [CalculationService, CsvService],
  bootstrap: [AppComponent]
})
export class AppModule { }
