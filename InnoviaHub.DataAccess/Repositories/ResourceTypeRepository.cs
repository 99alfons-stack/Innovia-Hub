using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InnoviaHub.DataAccess.Repositories;

public class ResourceTypeRepository(InnoviaHubDbContext context) : IResourceTypeRepository
{
    public async Task<IEnumerable<ResourceType>> GetAllResourceTypes()
    {
        return await context.ResourceTypes.ToListAsync();
    }

    public async Task<ResourceType?> GetResourceTypeById(Guid resourceTypeId)
    {
        return await context.ResourceTypes.FindAsync(resourceTypeId);
    }

    public async Task<ResourceType?> GetResourceTypeByName(string resourceTypeName)
    {
        return await context.ResourceTypes
            .FirstOrDefaultAsync(r => r.Name.Equals(resourceTypeName));
    }

    public async Task AddResourceType(ResourceType resourceType)
    {
        context.ResourceTypes.Add(resourceType);
        await context.SaveChangesAsync();
    }

    public async Task UpdateResourceType(ResourceType resourceType)
    {
        context.ResourceTypes.Update(resourceType);
        await context.SaveChangesAsync();
    }

    public Task DeleteResourceType(ResourceType resourceType)
    {
        context.ResourceTypes.Remove(resourceType);
        return context.SaveChangesAsync();
    }
}