using InnoviaHub.DataAccess.Entities.Common;
using InnoviaHub.Shared.Enums;

namespace InnoviaHub.DataAccess.Entities;

public class Resource : Entity<Guid>
{
    public string Name { get; set; } = string.Empty;
    public Guid ResourceTypeId { get; set; }
    public ResourceType ResourceType { get; set; } = null!;
    public ResourceZone? Zone { get; set; }
    public int Capacity { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
