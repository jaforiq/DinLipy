import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Car } from '../../interfaces/Car';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CarService } from '../../services/carServices/car.service';

@Component({
  selector: 'app-car-booking',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatNativeDateModule,
  ],
  templateUrl: './car-booking.component.html',
  styleUrl: './car-booking.component.css',
})
export class CarBookingComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() cars: Car[] = [];

  bookingForm!: FormGroup;
  minDate = new Date();

  weekDays = [
    { label: 'S', value: 'sunday' },
    { label: 'M', value: 'monday' },
    { label: 'T', value: 'tuesday' },
    { label: 'W', value: 'wednesday' },
    { label: 'T', value: 'thursday' },
    { label: 'F', value: 'friday' },
    { label: 'S', value: 'saturday' },
  ];

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private router: Router,
    private carService: CarService
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.bookingForm = this.fb.group(
      {
        subject: ['', Validators.required],
        car: ['', Validators.required],
        bookingDate: ['', [Validators.required, this.futureDateValidator()]],
        startTime: ['', Validators.required],
        endTime: ['', [Validators.required]],
        repeatFrequency: ['weekly'],
        endDate: ['', [Validators.required, this.endDateValidator()]],
        sunday: [false],
        monday: [false],
        tuesday: [false],
        wednesday: [false],
        thursday: [false],
        friday: [false],
        saturday: [false],
      },
      { validators: this.timeRangeValidator }
    );
  }

  futureDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return { pastDate: true };
      }
      return null;
    };
  }

  endDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.bookingForm) return null;

      const endDate = new Date(control.value);
      const startDate = new Date(this.bookingForm.get('bookingDate')?.value);

      if (endDate < startDate) {
        return { endDateBeforeStart: true };
      }
      return null;
    };
  }

  timeRangeValidator(group: FormGroup) {
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;

    if (startTime && endTime && startTime >= endTime) {
      return { invalidTimeRange: true };
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // onSubmit() {
  //   if (this.bookingForm.valid) {
  //     console.log('Form data:', this.bookingForm.value);
  //     // Handle form submission

  //     this.router.navigate(['/']);
  //   } else {
  //     this.markFormGroupTouched(this.bookingForm);
  //   }
  // }

  onSubmit() {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.value;

      // Convert date fields to YYYY-MM-DD
      const formatDate = (date: Date) => date.toISOString().split('T')[0];

      // Convert time fields to HH:mm:ss
      const formatTime = (time: string) => `${time}:00`;

      // Convert weekday selections into a bitwise flag (Sunday = 1, Monday = 2, ..., Saturday = 64)
      const repeatDays = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      let daysToRepeatOn = 0;
      repeatDays.forEach((day, index) => {
        if (formData[day]) daysToRepeatOn |= 1 << index;
      });

      // Construct the final data object
      const bookingPayload = {
        bookingDate: formatDate(new Date(formData.bookingDate)),
        startTime: formatTime(formData.startTime),
        endTime: formatTime(formData.endTime),
        repeatOption: formData.repeatFrequency === 'weekly' ? 1 : 0,
        daysToRepeatOn: daysToRepeatOn,
        requestedOn: new Date().toISOString(),
        carId: formData.car,
      };

      console.log('Formatted Booking Data:', bookingPayload); // Debugging

      // Send data to the API
      this.carService.bookCar(bookingPayload).subscribe(
        (response) => {
          console.log('Booking successful:', response);
          this.router.navigate(['/']); // Redirect on success
        },
        (error) => {
          console.error('Booking failed:', error);
        }
      );
    } else {
      this.markFormGroupTouched(this.bookingForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onClose() {
    //closeBookingModal();
    this.close.emit();
  }
}
