using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using InnoviaHub.Shared.DTOs.ResourceType;

namespace InnoviaHub.Api.Services;

public class ResourceTypeService(IResourceTypeRepository repository) : IResourceTypeService
{
    public async Task<IEnumerable<ResourceTypeDto>> GetAllAsync()
    {
        var resourceTypes =  await repository.GetAllAsync();

        return
        [
            .. resourceTypes
                .Select(rt => new ResourceTypeDto
                {
                    Id = rt.Id, 
                    Name = rt.Name, 
                    Description = rt.Description
                })
        ];
    }

    public async Task<ResourceTypeDto?> GetByIdAsync(Guid id)
    {
        var resourceType = await repository.GetByIdAsync(id);
        
        if (resourceType is null)
            return null;
        
        return new ResourceTypeDto
        {
            Id = resourceType.Id,
            Name = resourceType.Name, 
            Description = resourceType.Description
        };
    }

    public async Task<ResourceTypeDto?> GetByNameAsync(string name)
    {
        var resourceType = await repository.GetByNameAsync(name);
        
        if (resourceType is null)
            return null;
        
        return new ResourceTypeDto
        {
            Id = resourceType.Id,
            Name = resourceType.Name, 
            Description = resourceType.Description
        };
    }

    public async Task<ResourceTypeDto> CreateAsync(ResourceTypeDto dto)
    {
        var existingResourceTypes = await repository.GetByNameAsync(dto.Name);

        if (existingResourceTypes is not null)
            throw new InvalidOperationException("RESOURCE_TYPE_ALREADY_EXISTS");

        var resourceType = new ResourceType
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description
        };
        
        await repository.AddAsync(resourceType);
        
        return new ResourceTypeDto
        {
            Id = resourceType.Id,
            Name = dto.Name, 
            Description = dto.Description
        };
    }

    public async Task<ResourceTypeDto> UpdateAsync(Guid id, ResourceTypeDto dto)
    {
        var existingResourceTypes = await repository.GetByIdAsync(id);
        
        if (existingResourceTypes is null)
            throw new KeyNotFoundException("RESOURCE_TYPE_NOT_FOUND");

        existingResourceTypes.Name = dto.Name;
        existingResourceTypes.Description = dto.Description;
        
        await repository.UpdateAsync(existingResourceTypes);
        
        return new ResourceTypeDto
        {
            Id = dto.Id,
            Name = dto.Name, 
            Description = dto.Description
        };
    }

    public async Task DeleteAsync(Guid resourceTypeId)
    {
        var rt = await repository.GetByIdAsync(resourceTypeId);
        
        if (rt is null)
            throw new KeyNotFoundException("RESOURCE_TYPE_NOT_FOUND");
        
        await repository.DeleteAsync(rt);
    }
}