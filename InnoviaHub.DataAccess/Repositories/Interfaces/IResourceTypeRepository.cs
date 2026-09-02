using InnoviaHub.DataAccess.Entities;

namespace InnoviaHub.DataAccess.Repositories.Interfaces;

public interface IResourceTypeRepository
{
    Task<IEnumerable<ResourceType>> GetAllResourceTypes();
    Task<ResourceType?> GetResourceTypeById(Guid resourceTypeId);
    Task<ResourceType?> GetResourceTypeByName(string resourceTypeName);
    Task AddResourceType(ResourceType resourceType);
    Task UpdateResourceType(ResourceType resourceType);
    Task DeleteResourceType(ResourceType resourceType);
}