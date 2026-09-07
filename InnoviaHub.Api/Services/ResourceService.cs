using InnoviaHub.Api.Mappings;
using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using InnoviaHub.Shared.DTOs.Resource;

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
                .Select(r => r.ToDto())
        ];
    }

    public async Task<ResourceDto?> GetByIdAsync(Guid id)
    {
        var resource = await resourceRepository.GetByIdAsync(id);

        if (resource is null)
            return null;

        return resource.ToDto();
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
        
        return resource.ToDto();
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

        return resource.ToDto();
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