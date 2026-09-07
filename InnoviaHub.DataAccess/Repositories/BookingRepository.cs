using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InnoviaHub.DataAccess.Repositories;

public class BookingRepository(InnoviaHubDbContext context) : IBookingRepository
{
    public async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await context.Bookings
        .Include(b => b.User)
        .Include(b => b.Resource)
            .ThenInclude(r => r.ResourceType)
        .ToListAsync();
    }

    public async Task<Booking?> GetByIdAsync(Guid id)
    {
        return await context.Bookings
        .Include(b => b.User)
        .Include(b => b.Resource)
            .ThenInclude(r => r.ResourceType)
        .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<IEnumerable<Booking>> GetByUserIdAsync(Guid userId)
    {
        return await context.Bookings
        .Include(b => b.User)
        .Include(b => b.Resource)
            .ThenInclude(r => r.ResourceType)
        .Where(b => b.UserId == userId)
        .ToListAsync();
    }

    public async Task UpdateAsync(Booking booking)
    {
        context.Bookings.Update(booking);
        await context.SaveChangesAsync();
    }
    
    public async Task AddAsync(Booking booking)
    {
        await context.Bookings.AddAsync(booking);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Booking booking)
    {
        context.Bookings.Remove(booking);
        await context.SaveChangesAsync();
    }

    public async Task<bool> HasConflictsAsync(Guid resourceId, DateTime startTime, DateTime endTime, Guid? excludingBookingId = null)
    {
        return await context.Bookings.AnyAsync(b =>
            b.ResourceId == resourceId &&
            !b.IsCancelled &&
            (!excludingBookingId.HasValue || b.Id == excludingBookingId.Value) &&
            b.StartTime < endTime &&
            b.EndTime > startTime);
    }
}