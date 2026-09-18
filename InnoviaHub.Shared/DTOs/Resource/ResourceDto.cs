using InnoviaHub.Shared.DTOs.ResourceType;
using InnoviaHub.Shared.Enums;

namespace InnoviaHub.Shared.DTOs.Resource;

public class ResourceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ResourceTypeDto ResourceType { get; set; } = null!;
    public ResourceZone? Zone { get; set; }
    public int Capacity { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
}