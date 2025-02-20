import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}
  private eventUrl =
    'https://www.gov.uk/bank-holidays.json?ref=public_apis&utm_medium=website';
  getAllEvents(): Observable<Event[]> {
    const res = this.http.get<Event[]>(this.eventUrl);
    return res;
  }
}
