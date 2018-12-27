import { Component, AfterViewInit } from '@angular/core';
import { CalculationService } from './services/calculation.service'
import { ReservationModel } from './models/reservation.model';
import { ResultModel } from './models/result.model';
import { MonthModel } from './models/month.model';
import { PredefinedCalcModel } from './models/predefined.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Elbit-Offices';
  file: File;
  year: number;
  month: string;
  monthes: MonthModel[];
  reports: string[];
  predefinedArr: PredefinedCalcModel[];

  constructor(private calcService: CalculationService) {
    this.initMonthes();
    this.month = '2';
    this.year = 2014;

    this.reports = [];

    this.fillPredefined();
  }

  clear(): void {
    this.reports = [];
  }

  changeListener($event): void {
    this.file = $event.target.files[0];

    this.calculatePredefined();
  }

  calculatePredefined() {
    if (this.predefinedArr.length) {
      this.year = this.predefinedArr[0].year;
      this.month = this.predefinedArr[0].month;
      this.calculate();
    }
  }

  calculate() {
    const month = +this.month;
    this.calculateResults(this.year, month);
  }

  calculateResults(year: number, month: number): void {
    this.calcService.calculate(this.file, year, month, this.calculationFinished);
  }

  calculationFinished = (result: ResultModel): void => {

    if (result.status !== 0) {
      this.reports.push("Calculation problem occured");
      return;
    }

    const report = this.generateReport(result);
    this.reports.push(report);

    if (this.predefinedArr.length) {
      this.predefinedArr.shift();
      this.calculatePredefined();
    }
  }

  private generateReport = (result: ResultModel): string => {
    return `${this.year}-${+this.month + 1}: expected revenue: $${result.revenue}, 
            expected total capacity of the unreserved offices: ${result.capacity}`;
  }

  private initMonthes(): void {
    this.monthes = [
      {
        num: 0,
        name: 'January'
      },
      {
        num: 1,
        name: 'February'
      },
      {
        num: 2,
        name: 'Marth'
      },
      {
        num: 3,
        name: 'April'
      },
      {
        num: 4,
        name: 'May'
      },
      {
        num: 5,
        name: 'June'
      },
      {
        num: 6,
        name: 'July'
      },
      {
        num: 7,
        name: 'August'
      },
      {
        num: 8,
        name: 'September'
      },
      {
        num: 9,
        name: 'October'
      },
      {
        num: 10,
        name: 'Novermber'
      },
      {
        num: 11,
        name: 'December'
      },
    ];
  }

  private fillPredefined() {
    this.predefinedArr = [
      { year: 2013, month: '0' },
      { year: 2013, month: '5' },
      { year: 2014, month: '2' },
      { year: 2014, month: '8' },
      { year: 2015, month: '6' },
    ];
  }
}
