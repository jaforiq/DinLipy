import { Component } from '@angular/core';
import { Car } from '../../interfaces/Car';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CarService } from '../../services/carServices/car.service';
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
  cars: Car[] = [];

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.carService.getCars().subscribe(
      (cars) => (this.cars = cars),
      (error) => console.error('Error fetching cars:', error)
    );
  }

  openBookingModal() {
    this.showBookingModal = true;
  }

  closeBookingModal() {
    this.showBookingModal = false;
  }
}
