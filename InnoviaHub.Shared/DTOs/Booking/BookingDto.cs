using InnoviaHub.Shared.DTOs.Resource;
using InnoviaHub.Shared.DTOs.User;

namespace InnoviaHub.Shared.DTOs.Booking;

public class BookingDto
{
    public Guid Id {get; set;}
    public UserSummaryDto User { get; set; } = null!;
    public ResourceDto Resource { get; set; } = null!;
    public DateTime StartTime {get; set;}
    public DateTime EndTime {get; set;}
    public DateTime CreatedAt {get; set;}
    public bool IsCancelled {get; set;}
}