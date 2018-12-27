import { Injectable } from '@angular/core'
import { ReservationModel } from '../models/reservation.model'


@Injectable()
export class CsvService {
  readFile(file: File, done: (reservations: ReservationModel[]) => void): void {

    var reader = new FileReader();
    reader.readAsText(file);

    reader.onloadend = (data) => {
      let result: string = <string>reader.result;
      let lines = result.split(/\r\n|\n/);

      if (!lines || lines.length < 2) {
        done(null);
        return;
      }

      let arr: ReservationModel[] = [];

      try {
        for (let i: number = 1; i < lines.length; i++) {
          let line = lines[i];
          let parts = line.split(',');
          if (parts.length < 4)
            continue;

          let model = new ReservationModel();
          this.fillModel(model, parts);
          arr.push(model);
        }
      }
      catch (error) {
        done(error);
        return;
      }

      done(arr);
    }
  }

  fillModel(model: ReservationModel, parts: string[]): void {
    model.capacity = +parts[0];
    model.price = +parts[1];
    model.start = new Date(parts[2]);
    let end = parts[3].trim();
    if (!end)
      model.end = undefined;
    else 
      model.end = new Date(end);
    
    // set hours in order to intersection of ranges worked correctly
    model.start.setHours(0);
    if(model.end)
      model.end.setHours(23);
  }
}