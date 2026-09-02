using InnoviaHub.Shared.DTOs.ResourceType;

namespace InnoviaHub.Api.Services.Interfaces;

public interface IResourceTypeService
{
    Task<IEnumerable<ResourceTypeDto>> GetAllResourceTypes();
    Task<ResourceTypeDto?> GetResourceTypeById(Guid resourceTypeId);
    Task<ResourceTypeDto?> GetResourceTypeByName(string resourceTypeName);
    Task<ResourceTypeDto> CreateResourceType(ResourceTypeDto newResourceType);
    Task<ResourceTypeDto> UpdateResourceType(Guid resourceTypeId, ResourceTypeDto newResourceType);
    Task DeleteResourceType(Guid resourceTypeId);
}