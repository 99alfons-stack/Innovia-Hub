using InnoviaHub.DataAccess.Entities.Common;

namespace InnoviaHub.DataAccess.Entities;

public class Resource : Entity<Guid>
{
    public string Name { get; set; } = string.Empty;
    public Guid ResourceTypeId { get; set; }
    public ResourceType ResourceType { get; set; } = null!;
    public int Capacity { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
