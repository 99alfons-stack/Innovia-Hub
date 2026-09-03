using InnoviaHub.DataAccess.Entities;

namespace InnoviaHub.DataAccess.Repositories.Interfaces;

public interface IResourceTypeRepository
{
    Task<IEnumerable<ResourceType>> GetAllAsync();
    Task<ResourceType?> GetByIdAsync(Guid id);
    Task<ResourceType?> GetByNameAsync(string name);
    Task AddAsync(ResourceType type);
    Task UpdateAsync(ResourceType type);
    Task DeleteAsync(ResourceType type);
}