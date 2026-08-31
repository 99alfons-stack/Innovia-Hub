using InnoviaHub.DataAccess.Entities.Common;

namespace InnoviaHub.DataAccess.Entities;

public class Resource : Entity<Guid>
{
    
    // Hämtar typ av resurs, t.ex. Desk, MeetingRoom, VRHeadset, AIServer
    public Guid ResourceTypeId { get; set; }

    // Namn på resursen, ex: "Drop-in Desk 1" eller "Meeting Room A"
    public string Name { get; set; } = string.Empty;

    // Antal personer eller kapacitet för resursen
    public int Capacity { get; set; }

    // Anger om resursen är tillgänglig just nu
    public bool IsAvailable { get; set; } = true;

    // När resursen skapades
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property för att hämta resurstypen
    public ResourceType? ResourceType { get; set; }
}
