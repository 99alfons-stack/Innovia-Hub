using InnoviaHub.Shared.Enums;

namespace InnoviaHub.Shared.DTOs.Resource;

public class CreateResourceDto
{
    public string Name { get; set; }
    public Guid ResourceTypeId { get; set; }
    public ResourceZone? Zone { get; set; } 
    public int Capacity { get; set; }
}