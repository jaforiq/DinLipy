import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from '../../component/calendar/calendar.component';
import { CarBookingComponent } from '../car-booking/car-booking.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    CalendarComponent,
    CarBookingComponent,
    MatIconModule,
    MatButtonModule,
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  showBookingModal = false;

  openBookingModal() {
    this.showBookingModal = true;
  }

  closeBookingModal() {
    this.showBookingModal = false;
  }
}
