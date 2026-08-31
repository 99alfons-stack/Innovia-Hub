
using InnoviaHub.DataAccess.Entities.Common;

namespace InnoviaHub.DataAccess.Entities;

public class ResourceType : Entity<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}