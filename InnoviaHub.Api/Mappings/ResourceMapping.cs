using InnoviaHub.DataAccess.Entities;
using InnoviaHub.Shared.DTOs.Resource;

namespace InnoviaHub.Api.Mappings;

public static class ResourceMapping
{
    public static ResourceDto ToDto(this Resource model)
    {
        return new ResourceDto
        {
            Id = model.Id,
            Name = model.Name,
            ResourceType = model.ResourceType.ToDto(),
            Zone = model.Zone,
            Capacity = model.Capacity,
            IsActive = model.IsActive,
            CreatedAt = model.CreatedAt,
        };
    }
}