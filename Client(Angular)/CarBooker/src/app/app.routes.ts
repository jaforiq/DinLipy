import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CarBookingComponent } from './pages/car-booking/car-booking.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'add',
    component: CarBookingComponent,
  },
];
