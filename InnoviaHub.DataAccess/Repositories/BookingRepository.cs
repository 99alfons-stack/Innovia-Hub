using InnoviaHub.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace InnoviaHub.DataAccess.Repositories;

public class BookingRepository(InnoviaHubDbContext context) : IBookingRepository
{
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

    public async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await context.Bookings
        .Include(b => b.User)
        .ToListAsync();
    }

    public async Task<Booking?> GetByIdAsync(Guid id)
    {
        return await context.Bookings
        .Include(b => b.User)
        .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<IEnumerable<Booking>> GetByUserIdAsync(Guid userId)
    {
        return await context.Bookings
        .Include(b => b.User)
        .Where(b => b.UserId == userId)
        .ToListAsync();
    }

    public async Task UpdateAsync(Booking booking)
    {
        context.Bookings.Update(booking);
        await context.SaveChangesAsync();
    }
}