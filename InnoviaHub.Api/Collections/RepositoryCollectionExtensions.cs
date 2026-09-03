using InnoviaHub.DataAccess.Repositories;
using InnoviaHub.DataAccess.Repositories.Interfaces;

namespace InnoviaHub.Api.Collections;

// Samlingspunkt för alla repositories
// Lägg in repositories här i en service.AddScoped<Interface, Klass>
public static class RepositoryCollectionExtensions
{
    public static IServiceCollection AddApplicationRepositories(this IServiceCollection services)
    {
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IResourceTypeRepository, ResourceTypeRepository>();
        services.AddScoped<IResourceRepository, ResourceRepository>();
        
        return services;
    }
}