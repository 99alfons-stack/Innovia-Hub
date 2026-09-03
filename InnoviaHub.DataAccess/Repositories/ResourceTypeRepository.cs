using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InnoviaHub.DataAccess.Repositories;

public class ResourceTypeRepository(InnoviaHubDbContext context) : IResourceTypeRepository
{
    public async Task<IEnumerable<ResourceType>> GetAllAsync()
    {
        return await context.ResourceTypes.ToListAsync();
    }

    public async Task<ResourceType?> GetByIdAsync(Guid id)
    {
        return await context.ResourceTypes.FindAsync(id);
    }

    public async Task<ResourceType?> GetByNameAsync(string name)
    {
        return await context.ResourceTypes
            .FirstOrDefaultAsync(r => r.Name.Equals(name));
    }

    public async Task AddAsync(ResourceType type)
    {
        context.ResourceTypes.Add(type);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(ResourceType type)
    {
        context.ResourceTypes.Update(type);
        await context.SaveChangesAsync();
    }

    public Task DeleteAsync(ResourceType type)
    {
        context.ResourceTypes.Remove(type);
        return context.SaveChangesAsync();
    }
}