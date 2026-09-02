using InnoviaHub.DataAccess.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InnoviaHub.DataAccess;

public class InnoviaHubDbContext: IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public InnoviaHubDbContext(DbContextOptions<InnoviaHubDbContext> options) : base(options)
    {
    }
    
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<ResourceType> ResourceTypes => Set<ResourceType>();
    public DbSet<Resource> Resources => Set<Resource>();
}
