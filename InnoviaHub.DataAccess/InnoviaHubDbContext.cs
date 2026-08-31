using InnoviaHub.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace InnoviaHub.DataAccess;

public class InnoviaHubDbContext(DbContextOptions<InnoviaHubDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    public DbSet<ResourceType> ResourceTypes => Set<ResourceType>();
    
    public DbSet<Resource> Resources => Set<Resource>();
}