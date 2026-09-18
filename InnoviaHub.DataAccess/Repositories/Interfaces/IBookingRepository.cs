using InnoviaHub.DataAccess.Entities;

namespace InnoviaHub.DataAccess.Repositories.Interfaces;

public interface IBookingRepository
{
    Task<Booking?> GetByIdAsync(Guid id);
    Task<IEnumerable<Booking>> GetAllAsync();
    Task<IEnumerable<Booking>> GetByUserIdAsync(Guid userId);
    Task AddAsync(Booking booking);
    Task UpdateAsync(Booking booking);
    Task DeleteAsync(Booking booking);
    Task<bool> HasConflictsAsync(Guid resourceId, DateTime startTime, DateTime endTime, Guid? excludingBookingId = null);
}