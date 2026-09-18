using InnoviaHub.Shared.Enums;

namespace InnoviaHub.Shared.DTOs.Resource;

public class UpdateResourceDto
{
    public string Name { get; set; }
    public Guid ResourceTypeId { get; set; }
    public ResourceZone? Zone { get; set; }
    public int Capacity { get; set; }
    public bool IsActive { get; set; }
}