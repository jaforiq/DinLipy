using Wafi.SampleTest.Dtos;
using Wafi.SampleTest.Entities;

namespace Wafi.SampleTest.Mappers;

public static class BookingMapper
{
    public static BookingCalendarDto ToBookingCalendarDto(this Booking booking)
    {
        return new BookingCalendarDto()
        {
            BookingDate = booking.BookingDate,
            StartTime = booking.StartTime,
            EndTime = booking.EndTime,
            CarModel = booking.Car.Model,
        };
    }

    public static Booking ToBooking(this CreateUpdateBookingDto booking)
    {
        return new Booking()
        {
            BookingDate = booking.BookingDate,
            StartTime = booking.StartTime,
            EndTime = booking.EndTime,
            RepeatOption = booking.RepeatOption,
            EndRepeatDate = booking.EndRepeatDate,
            DaysToRepeatOn = booking.DaysToRepeatOn,
            RequestedOn = booking.RequestedOn,
            CarId = booking.CarId,
        };
    }

    public static CreateUpdateBookingDto ToCreateUpdateBookingDto(this Booking booking)
    {
        return new CreateUpdateBookingDto()
        {
            Id = booking.Id,
            BookingDate = booking.BookingDate,
            StartTime = booking.StartTime,
            EndTime = booking.EndTime,
            RepeatOption = booking.RepeatOption,
            EndRepeatDate = booking.EndRepeatDate,
            DaysToRepeatOn = booking.DaysToRepeatOn,
            RequestedOn = booking.RequestedOn,
            CarId = booking.CarId,
        };
    }
}