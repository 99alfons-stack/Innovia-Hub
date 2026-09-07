using InnoviaHub.Api.Mappings;
using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using InnoviaHub.Shared.DTOs.Booking;

namespace InnoviaHub.Api.Services;

public class BookingService(IBookingRepository bookingRepository) : IBookingService
{
    public async Task<IEnumerable<BookingDto>> GetAllAsync()
    {
        var bookings = await bookingRepository.GetAllAsync();
        return
        [
            .. bookings
                .Select(b => b.ToDto())
        ];
    }

    public async Task<BookingDto?> GetByIdAsync(Guid id)
    {
        var booking = await bookingRepository.GetByIdAsync(id);

        if (booking is null)
            return null;
        
        return booking.ToDto();
    }

    public async Task<BookingDto> CreateAsync(Guid userId, CreateBookingDto dto)
    {
        if (dto.StartTime >= dto.EndTime)
            throw new InvalidOperationException("INVALID_BOOKING_TIME");
        
        var hasConflicts = await bookingRepository.HasConflictsAsync(
            dto.ResourceId,
            dto.StartTime,
            dto.EndTime
        );
        
        if (hasConflicts)
            throw new InvalidOperationException("RESOURCE_ALREADY_BOOKED");

        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ResourceId = dto.ResourceId,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            CreatedAt = DateTime.UtcNow,
            IsCancelled = false
        };
        
        await bookingRepository.AddAsync(booking);
        
        var createdBooking = await bookingRepository.GetByIdAsync(booking.Id);
        
        if (createdBooking is null)
            throw new KeyNotFoundException("BOOKING_NOT_FOUND");

        return createdBooking.ToDto();
    }

    public async Task<BookingDto?> UpdateAsync(Guid id, Guid userId, bool isAdmin, UpdateBookingDto dto)
    {
        if (dto.StartTime >= dto.EndTime)
            throw new InvalidOperationException("INVALID_BOOKING_TIME");
        
        var booking = await bookingRepository.GetByIdAsync(id);

        if (booking is null)
            return null;
        
        if (booking.UserId != userId && !isAdmin)
            throw new UnauthorizedAccessException();
        
        var hasConflicts = await bookingRepository.HasConflictsAsync(
            dto.ResourceId,
            dto.StartTime,
            dto.EndTime,
            id
        );
        
        if (hasConflicts)
            throw new InvalidOperationException("RESOURCE_ALREADY_BOOKED");

        booking.ResourceId = dto.ResourceId;
        booking.StartTime = dto.StartTime;
        booking.EndTime = dto.EndTime;
        
        await bookingRepository.UpdateAsync(booking);
        
        var updatedBooking = await bookingRepository.GetByIdAsync(booking.Id);
        
        if (updatedBooking is null)
            throw new KeyNotFoundException("BOOKING_NOT_FOUND");
        
        return updatedBooking.ToDto();
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var booking = await bookingRepository.GetByIdAsync(id);

        if (booking is null)
            return false;

        if (booking.UserId != userId)
            throw new UnauthorizedAccessException();
        
        await bookingRepository.DeleteAsync(booking);
        
        return true;
    }

    public async Task<bool> CancelAsync(Guid id, Guid userId, bool isAdmin)
    {
        var booking = await bookingRepository.GetByIdAsync(id);
        
        if (booking is null)
            return false;

        if (booking.UserId != userId && !isAdmin)
            throw new UnauthorizedAccessException();

        booking.IsCancelled = true;
        
        await bookingRepository.UpdateAsync(booking);
        
        return true;
    }
}