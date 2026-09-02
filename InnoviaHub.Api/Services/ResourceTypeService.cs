using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using InnoviaHub.Shared.DTOs.ResourceType;

namespace InnoviaHub.Api.Services;

public class ResourceTypeService(IResourceTypeRepository repository) : IResourceTypeService
{
    public async Task<IEnumerable<ResourceTypeDto>> GetAllResourceTypes()
    {
        var resourceTypes =  await repository.GetAllResourceTypes();

        return resourceTypes
            .Select(rt => new ResourceTypeDto { Id = rt.Id, Name = rt.Name, Description = rt.Description })
            .ToList();
    }

    public async Task<ResourceTypeDto?> GetResourceTypeById(Guid resourceTypeId)
    {
        var rt = await repository.GetResourceTypeById(resourceTypeId);
        
        if (rt is null)
            return null;
        
        return new ResourceTypeDto { Name = rt.Name, Description = rt.Description };
    }

    public async Task<ResourceTypeDto?> GetResourceTypeByName(string name)
    {
        var rt = await repository.GetResourceTypeByName(name);
        
        if (rt is null)
            return null;
        
        return new ResourceTypeDto { Name = rt.Name, Description = rt.Description };
    }

    public async Task<ResourceTypeDto> CreateResourceType(ResourceTypeDto newResourceType)
    {
        var existingResourceTypes = await repository.GetResourceTypeByName(newResourceType.Name);

        if (existingResourceTypes is not null)
            throw new ArgumentException("RESOURCE_TYPE_ALREADY_EXISTS");

        var resourceType = new ResourceType
        {
            Id = Guid.NewGuid(),
            Name = newResourceType.Name,
            Description = newResourceType.Description
        };
        
        await repository.AddResourceType(resourceType);
        
        return new ResourceTypeDto { Name = newResourceType.Name, Description = newResourceType.Description };
    }

    public async Task<ResourceTypeDto> UpdateResourceType(Guid resourceTypeId, ResourceTypeDto newResourceType)
    {
        var existingResourceTypes = await repository.GetResourceTypeById(resourceTypeId);
        
        if (existingResourceTypes is null)
            return null;

        existingResourceTypes.Name = newResourceType.Name;
        existingResourceTypes.Description = newResourceType.Description;
        
        await repository.UpdateResourceType(existingResourceTypes);
        
        return new ResourceTypeDto { Name = newResourceType.Name, Description = newResourceType.Description };
    }

    public async Task DeleteResourceType(Guid resourceTypeId)
    {
        var rt = await repository.GetResourceTypeById(resourceTypeId);
        
        if (rt is null)
            throw new ArgumentException("RESOURCE_TYPE_NOT_FOUND");
        
        await repository.DeleteResourceType(rt);
    }
}