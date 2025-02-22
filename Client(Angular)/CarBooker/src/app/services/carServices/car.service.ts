import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Car } from '../../interfaces/Car';
@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = 'http://localhost:5028/api/Bookings/Cars';

  constructor(private http: HttpClient) {}

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }

  private carUrl = 'http://localhost:5028/api/Bookings/Booking'; // API Endpoint

  bookCar(bookingData: any): Observable<any> {
    return this.http.post(this.carUrl, bookingData);
  }
}
