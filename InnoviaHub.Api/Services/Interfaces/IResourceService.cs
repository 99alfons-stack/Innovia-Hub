using InnoviaHub.Shared.DTOs.Resource;

namespace InnoviaHub.Api.Services.Interfaces;

public interface IResourceService
{
    Task<IEnumerable<ResourceDto>> GetAllAsync();
    Task<ResourceDto?> GetByIdAsync(Guid id);
    Task<ResourceDto> CreateAsync(CreateResourceDto dto);
    Task<ResourceDto> UpdateAsync(Guid id, UpdateResourceDto dto);
    Task<bool> DeleteAsync(Guid id);
}