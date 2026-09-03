using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InnoviaHub.DataAccess.Repositories;

public class ResourceRepository(InnoviaHubDbContext context) : IResourceRepository
{
    public async Task<IEnumerable<Resource>> GetAllAsync()
    {
        return await context.Resources.
            Include(rt => rt.ResourceType)
            .ToListAsync();
    }

    public async Task<Resource?> GetByIdAsync(Guid id)
    {
        return await context.Resources
            .Include(rt => rt.ResourceType)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task AddAsync(Resource resource)
    {
        await context.Resources.AddAsync(resource);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Resource resource)
    {
        context.Resources.Update(resource);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Resource resource)
    {
        context.Resources.Remove(resource);
        await context.SaveChangesAsync();
    }
}