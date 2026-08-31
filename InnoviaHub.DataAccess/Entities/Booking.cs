using InnoviaHub.DataAccess.Entities.Common;

namespace InnoviaHub.DataAccess.Entities;

public class Booking : Entity<Guid>
{
    public Guid UserId {get; set;} //behövs kanske ej? 
    public User User {get; set;} = null!;
    public string BookingType {get; set;} = string.Empty;
    public DateTime StartTime {get; set;}
    public DateTime EndTime {get; set;}
    public DateTime CreatedAt {get; set;}
    public bool IsCancelled {get; set;}
}