using Wafi.SampleTest.Dtos;
using Wafi.SampleTest.Mappers;
using Wafi.SampleTest.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Wafi.SampleTest.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookingsController : ControllerBase
{
    private readonly WafiDbContext _context;

    public BookingsController(WafiDbContext context)
    {
        _context = context;
    }

    // GET: api/Bookings
    [HttpGet("Booking")]
    public async Task<IEnumerable<BookingCalendarDto>> GetCalendarBookings([FromQuery] BookingFilterDto input)
    {
        // Get booking from the database and filter the data
        var queryToExecute = _context.Bookings
            .Where(b => ((DateOnly)b.BookingDate) >= input.StartBookingDate)
            .Where(b => ((DateOnly)b.BookingDate) <= input.EndBookingDate);

        if (input.CarId != Guid.Empty)
            queryToExecute = queryToExecute.Where(b => b.CarId == input.CarId);

        var bookings = await queryToExecute.Include(b => b.Car).ToListAsync();
        // var bookings = await _context.Bookings.ToListAsync();
        // Console.WriteLine("Booking: ", bookings);

        // TO DO: convert the database bookings to calendar view (date, start time, end time). Consiser NoRepeat, Daily and Weekly options
        var bookingCalendarDto = bookings.Select(booking => booking.ToBookingCalendarDto());

        return bookingCalendarDto;
    }

    // POST: api/Bookings
    [HttpPost("Booking")]
    public async Task<IActionResult> PostBooking(CreateUpdateBookingDto booking)
    {
        // TO DO: Validate if any booking time conflicts with existing data. Return error if any conflicts
        var car = _context.Cars.Where(c => c.Id == booking.CarId).FirstOrDefault();
        if(car is null) return BadRequest("You choosed an invalid car.");

        var queryToCheckWhetherCarIsBooked = _context.Bookings
            .Where(b => b.CarId == booking.CarId)
            .Where(b => b.BookingDate == booking.BookingDate)
            .Where(b => b.EndTime >= booking.StartTime)
            .Where(b => b.StartTime <= booking.EndTime);

        if (queryToCheckWhetherCarIsBooked.Any())
            return BadRequest("Car is already booked for the selected time");

        var bookingToCreate = booking.ToBooking();
        var createdBooking = await _context.Bookings.AddAsync(bookingToCreate);
        await _context.SaveChangesAsync();

        return Ok(createdBooking.Entity.ToCreateUpdateBookingDto());
    }

    // GET: api/Bookings/Cars
    [HttpGet("Cars")]
    public async Task<IEnumerable<Car>> GetCarsFromDb()
    {
        return await _context.Cars.ToListAsync();
    }
    // GET: api/SeedData
    // For test purpose
    [HttpGet("SeedData")]
    public async Task<IEnumerable<BookingCalendarDto>> GetSeedData()
    {
        var cars = await _context.Cars.ToListAsync();

        if (!cars.Any())
        {
            cars = GetCars().ToList();
            await _context.Cars.AddRangeAsync(cars);
            await _context.SaveChangesAsync();
        }

        var bookings = await _context.Bookings.ToListAsync();

        if (!bookings.Any())
        {
            bookings = GetBookings().ToList();

            await _context.Bookings.AddRangeAsync(bookings);
            await _context.SaveChangesAsync();
        }

        var calendar = new Dictionary<DateOnly, List<Booking>>();

        foreach (var booking in bookings)
        {
            var currentDate = booking.BookingDate;
            while (currentDate <= (booking.EndRepeatDate ?? booking.BookingDate))
            {
                if (!calendar.ContainsKey(currentDate))
                    calendar[currentDate] = new List<Booking>();

                calendar[currentDate].Add(booking);

                currentDate = booking.RepeatOption switch
                {
                    RepeatOption.Daily => currentDate.AddDays(1),
                    RepeatOption.Weekly => currentDate.AddDays(7),
                    _ => booking.EndRepeatDate.HasValue ? booking.EndRepeatDate.Value.AddDays(1) : currentDate.AddDays(1)
                };
            }
        }

        List<BookingCalendarDto> result = new List<BookingCalendarDto>();

        foreach (var item in calendar)
        {
            foreach (var booking in item.Value)
            {
                result.Add(new BookingCalendarDto { BookingDate = booking.BookingDate, CarModel = booking.Car.Model, StartTime = booking.StartTime, EndTime = booking.EndTime });
            }
        }

        return result;
    }

    #region Sample Data

    private IList<Car> GetCars()
    {
        var cars = new List<Car>
            {
                new Car { Id = Guid.NewGuid(), Make = "Toyota", Model = "Corolla" },
                new Car { Id = Guid.NewGuid(), Make = "Honda", Model = "Civic" },
                new Car { Id = Guid.NewGuid(), Make = "Ford", Model = "Focus" }
            };

        return cars;
    }

    private IList<Booking> GetBookings()
    {
        var cars = GetCars();

        var bookings = new List<Booking>
            {
                new Booking { Id = Guid.NewGuid(), BookingDate = new DateOnly(2025, 2, 5), StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(12, 0, 0), RepeatOption = RepeatOption.DoesNotRepeat, RequestedOn = DateTime.Now, CarId = cars[0].Id, Car = cars[0] },
                new Booking { Id = Guid.NewGuid(), BookingDate = new DateOnly(2025, 2, 10), StartTime = new TimeSpan(14, 0, 0), EndTime = new TimeSpan(16, 0, 0), RepeatOption = RepeatOption.Daily, EndRepeatDate = new DateOnly(2025, 2, 20), RequestedOn = DateTime.Now, CarId = cars[1].Id, Car = cars[1] },
                new Booking { Id = Guid.NewGuid(), BookingDate = new DateOnly(2025, 2, 15), StartTime = new TimeSpan(9, 0, 0), EndTime = new TimeSpan(10, 30, 0), RepeatOption = RepeatOption.Weekly, EndRepeatDate = new DateOnly(2025, 3, 31), RequestedOn = DateTime.Now, DaysToRepeatOn = DaysOfWeek.Monday, CarId = cars[2].Id,  Car = cars[2] },
                new Booking { Id = Guid.NewGuid(), BookingDate = new DateOnly(2025, 3, 1), StartTime = new TimeSpan(11, 0, 0), EndTime = new TimeSpan(13, 0, 0), RepeatOption = RepeatOption.DoesNotRepeat, RequestedOn = DateTime.Now, CarId = cars[0].Id, Car = cars[0] },
                new Booking { Id = Guid.NewGuid(), BookingDate = new DateOnly(2025, 3, 7), StartTime = new TimeSpan(8, 0, 0), EndTime = new TimeSpan(10, 0, 0), RepeatOption = RepeatOption.Weekly, EndRepeatDate = new DateOnly(2025, 3, 28), RequestedOn = DateTime.Now, DaysToRepeatOn = DaysOfWeek.Friday, CarId = cars[1].Id, Car = cars[1] },
                new Booking { Id = Guid.NewGuid(), BookingDate = new DateOnly(2025, 3, 15), StartTime = new TimeSpan(15, 0, 0), EndTime = new TimeSpan(17, 0, 0), RepeatOption = RepeatOption.Daily, EndRepeatDate = new DateOnly(2025, 3, 20), RequestedOn = DateTime.Now, CarId = cars[2].Id,  Car = cars[2] }
            };

        return bookings;
    }

    #endregion

}
