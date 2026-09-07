using InnoviaHub.Shared.DTOs.ResourceType;

namespace InnoviaHub.Api.Services.Interfaces;

public interface IResourceTypeService
{
    Task<IEnumerable<ResourceTypeDto>> GetAllAsync();
    Task<ResourceTypeDto?> GetByIdAsync(Guid id);
    Task<ResourceTypeDto?> GetByNameAsync(string name);
    Task<ResourceTypeDto> CreateAsync(CreateResourceTypeDto dto);
    Task<ResourceTypeDto> UpdateAsync(Guid id, UpdateResourceTypeDto dto);
    Task DeleteAsync(Guid id);
}