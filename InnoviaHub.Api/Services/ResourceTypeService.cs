using InnoviaHub.Api.Mappings;
using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using InnoviaHub.Shared.DTOs.ResourceType;

namespace InnoviaHub.Api.Services;

public class ResourceTypeService(IResourceTypeRepository typeRepository) : IResourceTypeService
{
    public async Task<IEnumerable<ResourceTypeDto>> GetAllAsync()
    {
        var resourceTypes =  await typeRepository.GetAllAsync();

        return
        [
            .. resourceTypes
                .Select(rt => rt.ToDto())
        ];
    }

    public async Task<ResourceTypeDto?> GetByIdAsync(Guid id)
    {
        var resourceType = await typeRepository.GetByIdAsync(id);
        
        if (resourceType is null)
            return null;
        
        return resourceType.ToDto();
    }

    public async Task<ResourceTypeDto?> GetByNameAsync(string name)
    {
        var resourceType = await typeRepository.GetByNameAsync(name);
        
        if (resourceType is null)
            return null;
        
        return resourceType.ToDto();
    }

    public async Task<ResourceTypeDto> CreateAsync(CreateResourceTypeDto dto)
    {
        var existingResourceTypes = await typeRepository.GetByNameAsync(dto.Name);

        if (existingResourceTypes is not null)
            throw new InvalidOperationException("RESOURCE_TYPE_ALREADY_EXISTS");

        var resourceType = new ResourceType
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description
        };
        
        await typeRepository.AddAsync(resourceType);
        
        return resourceType.ToDto();
    }

    public async Task<ResourceTypeDto> UpdateAsync(Guid id, UpdateResourceTypeDto dto)
    {
        var resourceType = await typeRepository.GetByIdAsync(id);
        
        if (resourceType is null)
            throw new KeyNotFoundException("RESOURCE_TYPE_NOT_FOUND");

        resourceType.Name = dto.Name;
        resourceType.Description = dto.Description;
        
        await typeRepository.UpdateAsync(resourceType);
        
        return resourceType.ToDto();
    }

    public async Task DeleteAsync(Guid resourceTypeId)
    {
        var rt = await typeRepository.GetByIdAsync(resourceTypeId);
        
        if (rt is null)
            throw new KeyNotFoundException("RESOURCE_TYPE_NOT_FOUND");
        
        await typeRepository.DeleteAsync(rt);
    }
}