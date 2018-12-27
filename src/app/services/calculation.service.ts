import { Injectable } from '@angular/core';
import { CsvService } from './csv.service';
import { ReservationModel } from '../models/reservation.model';
import { ResultModel } from '../models/result.model';
import { extendMoment, DateRange } from 'moment-range';
import * as moment from 'moment'


@Injectable()
export class CalculationService {

  doneCallback: (result: ResultModel) => void;
  year: number;
  month: number;
  momentRange = extendMoment(moment);

  constructor(private csvService: CsvService) { }

  calculate(file: File, year: number, month: number, done: (result: ResultModel) => void): void {

    this.doneCallback = done;
    this.year = year;
    this.month = month;

    return this.csvService.readFile(file, this.readFileDone);
  }

  readFileDone = (reservations: ReservationModel[] | null | Error): void => {

    if (reservations == null || reservations instanceof Error) {
      let result: ResultModel = { capacity: 0, revenue: 0, status: 1 }; // return error - status 1
      this.doneCallback(result);
      return;
    }

    let result: ResultModel = this.implementCalculation(reservations);
    this.doneCallback(result);
  }

  implementCalculation(reservations: ReservationModel[]): ResultModel {

    let total: ResultModel = { capacity: 0, revenue: 0, status: 0 };

    const { year, month } = this;
    let d = new Date(year, month);
    let daysInMonth: number = moment(d).daysInMonth();
    let monthStart: Date = new Date(year, month, 1, 0);
    let monthEnd: Date = new Date(year, month, daysInMonth, 23);

    for (const reservation of reservations) {
      const res: ResultModel = this.calculateForOffice(reservation, monthStart, monthEnd, daysInMonth);
      total.capacity += res.capacity;
      total.revenue += res.revenue;
    }

    return total;
  }

  calculateForOffice(reservation: ReservationModel, monthStart: Date, monthEnd: Date,
    daysInMonth: number): ResultModel {

    let result: ResultModel = new ResultModel();
    result.status = 0;
    result.capacity = 0;

    if (!reservation.end) {
      reservation.end = new Date(5000, 1);
    }
    const range1 = this.momentRange.range(reservation.start, reservation.end);
    const range2 = this.momentRange.range(monthStart, monthEnd);

    let range: DateRange = range1.intersect(range2);
    if (!range) { // month does not intersect reservation period
      return {
        capacity: reservation.capacity,
        revenue: 0,
        status: 0
      };
    }

    let overlapDays = range.end.diff(range.start, 'days') + 1;
    let revenue = Math.round(reservation.price * overlapDays / daysInMonth);

    result.revenue = revenue;

    return result;
  }
}