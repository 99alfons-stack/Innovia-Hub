using InnoviaHub.DataAccess.Entities.Common;

namespace InnoviaHub.DataAccess.Entities;

public class Booking : Entity<Guid>
{
    public Guid UserId {get; set;}
    public User User {get; set;} = null!;
    public Guid ResourceId {get; set;}
    public Resource Resource { get; set; } = null!;
    public DateTime StartTime {get; set;}
    public DateTime EndTime {get; set;}
    public DateTime CreatedAt {get; set;}
    public bool IsCancelled {get; set;}
}