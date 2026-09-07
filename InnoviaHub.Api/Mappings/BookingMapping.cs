using InnoviaHub.DataAccess.Entities;
using InnoviaHub.Shared.DTOs.Booking;
using InnoviaHub.Shared.DTOs.User;

namespace InnoviaHub.Api.Mappings;

public static class BookingMapping
{
    public static BookingDto ToDto(this Booking model)
    {
        return new BookingDto
        {
            Id = model.Id,
            User = model.User.ToSummaryDto(),
            Resource = model.Resource.ToDto(),
            StartTime = model.StartTime,
            EndTime = model.EndTime,
            CreatedAt = model.CreatedAt,
            IsCancelled = model.IsCancelled,
        };
    }
}