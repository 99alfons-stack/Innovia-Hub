using InnoviaHub.DataAccess.Entities;

namespace InnoviaHub.DataAccess.Repositories.Interfaces;

public interface IResourceRepository
{
    Task<IEnumerable<Resource>> GetAllAsync();
    Task<Resource?> GetByIdAsync(Guid id);
    Task AddAsync(Resource resource);
    Task UpdateAsync(Resource resource);
    Task DeleteAsync(Resource resource);
}