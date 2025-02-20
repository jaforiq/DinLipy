import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CalendarComponent } from '../../component/calendar/calendar.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CalendarComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  title = 'car-booking';
}
