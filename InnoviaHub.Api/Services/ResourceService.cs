using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using InnoviaHub.Shared.DTOs.Resource;
using InnoviaHub.Shared.DTOs.ResourceType;

namespace InnoviaHub.Api.Services;

public class ResourceService(IResourceRepository resourceRepository, 
    IResourceTypeRepository typeRepository) : IResourceService
{
    public async Task<IEnumerable<ResourceDto>> GetAllAsync()
    {
        var resources = await resourceRepository.GetAllAsync();
        return
        [
            .. resources
                .Select(r => new ResourceDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    ResourceType = new ResourceTypeDto
                    {
                        Id = r.ResourceType.Id,
                        Name = r.ResourceType.Name,
                        Description = r.ResourceType.Description
                    },
                    IsActive = r.IsActive,
                    Capacity = r.Capacity,
                    CreatedAt = r.CreatedAt
                })
        ];
    }

    public async Task<ResourceDto?> GetByIdAsync(Guid id)
    {
        var resource = await resourceRepository.GetByIdAsync(id);

        if (resource is null)
            return null;

        return new ResourceDto
        {
            Id = resource.Id,
            Name = resource.Name,
            ResourceType = new ResourceTypeDto
            {
                Id = resource.ResourceType.Id,
                Name = resource.ResourceType.Name,
                Description = resource.ResourceType.Description
            },
            IsActive = resource.IsActive,
            Capacity = resource.Capacity,
            CreatedAt = resource.CreatedAt
        };
    }

    public async Task<ResourceDto> CreateAsync(CreateResourceDto dto)
    {
        var resourceType = await typeRepository.GetByIdAsync(dto.ResourceTypeId);
        
        if (resourceType is null)
            throw new KeyNotFoundException("RESOURCE_TYPE_NOT_FOUND");

        var resource = new Resource
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            ResourceTypeId = resourceType.Id,
            IsActive = true,
            Capacity = dto.Capacity,
            CreatedAt = DateTime.UtcNow
        };
        
        await resourceRepository.AddAsync(resource);
        
        return new ResourceDto
        {
            Id = resource.Id,
            Name = resource.Name,
            ResourceType = new ResourceTypeDto
            {
                Id = resourceType.Id,
                Name = resourceType.Name,
                Description = resourceType.Description
            },
            IsActive = resource.IsActive,
            Capacity = resource.Capacity,
            CreatedAt = resource.CreatedAt
        };
    }

    public async Task<ResourceDto> UpdateAsync(Guid id, UpdateResourceDto dto)
    {
        var resource = await resourceRepository.GetByIdAsync(id);
        
        if (resource is null)
            throw new KeyNotFoundException("RESOURCE_NOT_FOUND");
        
        var resourceType = await typeRepository.GetByIdAsync(dto.ResourceTypeId);
        
        if (resourceType is null)
            throw new KeyNotFoundException("RESOURCE_TYPE_NOT_FOUND");
        
        resource.Name = dto.Name;
        resource.ResourceTypeId = resourceType.Id;
        resource.IsActive = dto.IsActive;
        resource.Capacity = dto.Capacity;
        await resourceRepository.UpdateAsync(resource);

        return new ResourceDto
        {
            Id = resource.Id,
            Name = resource.Name,
            ResourceType = new ResourceTypeDto
            {
                Id = resourceType.Id,
                Name = resourceType.Name,
                Description = resourceType.Description
            },
            IsActive = resource.IsActive,
            Capacity = resource.Capacity,
            CreatedAt = resource.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var resource = await resourceRepository.GetByIdAsync(id);

        if (resource is null)
            return false;

        await resourceRepository.DeleteAsync(resource);
        
        return true;
    }
}