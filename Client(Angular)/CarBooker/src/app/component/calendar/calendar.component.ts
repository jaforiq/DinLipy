

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventService } from '../../services/EventService/event.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  private eventService = inject(EventService);

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    selectable: true,
    dateClick: (info) => this.handleDateClick(info),
  };

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventService.getAllEvents().subscribe(
      (data: any) => {
        //console.log('Data: ', data);
        const events = this.mapEvents(data);
        this.calendarOptions = { ...this.calendarOptions, events };
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  mapEvents(apiData: any): any[] {
    if (!apiData || !apiData['england-and-wales']?.events) return [];

    return apiData['england-and-wales'].events.map((event: any) => ({
      title: event.title,
      date: event.date,
    }));
  }

  handleDateClick(info: any) {
    alert('Date clicked: ' + info.dateStr);
  }
}
