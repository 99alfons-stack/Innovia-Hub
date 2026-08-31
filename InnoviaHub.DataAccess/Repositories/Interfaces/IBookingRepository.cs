using InnoviaHub.DataAccess.Entities;

public interface IBookingRepository
{
    Task<Booking?> GetBookingById(Guid id);
    Task<IEnumerable<Booking>> GetAllBookings();
    Task<IEnumerable<Booking>> GetBookingsByUserId(Guid userId);
    Task AddBooking(Booking booking);
    Task UpdateBooking(Booking booking);
    Task DeleteBooking(Booking booking);
}