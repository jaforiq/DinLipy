import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';

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
    private router: Router
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

  onSubmit() {
    if (this.bookingForm.valid) {
      console.log('Form data:', this.bookingForm.value);
      // Handle form submission
      this.router.navigate(['/']);
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
