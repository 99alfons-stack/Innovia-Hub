using InnoviaHub.DataAccess.Entities;
using InnoviaHub.Shared.DTOs.ResourceType;

namespace InnoviaHub.Api.Mappings;

public static class ResourceTypeMapping
{
    public static ResourceTypeDto ToDto(this ResourceType model)
    {
        return new ResourceTypeDto
        {
            Id = model.Id,
            Name = model.Name,
            Description = model.Description
        };
    }
}