using InnoviaHub.Shared.DTOs.Booking;
using Microsoft.AspNetCore.Mvc;

namespace InnoviaHub.Api.Services.Interfaces;

public interface IBookingService
{
    Task<IEnumerable<BookingDto>> GetAllAsync();
    Task<BookingDto?> GetByIdAsync(Guid id);
    Task<BookingDto> CreateAsync(Guid userId, CreateBookingDto dto);
    Task<BookingDto?> UpdateAsync(Guid id, Guid userId, bool isAdmin, UpdateBookingDto dto);
    Task<bool> DeleteAsync(Guid id, Guid userId, bool isAdmin);
    Task<bool> CancelAsync(Guid id, Guid userId, bool isAdmin);
}