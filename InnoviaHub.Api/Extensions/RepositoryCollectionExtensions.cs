using InnoviaHub.DataAccess.Repositories;
using InnoviaHub.DataAccess.Repositories.Interfaces;

namespace InnoviaHub.Api.Extensions;

public static class RepositoryCollectionExtensions
{
    public static IServiceCollection AddApplicationRepositories(this IServiceCollection services)
    {
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IResourceTypeRepository, ResourceTypeRepository>();
        services.AddScoped<IResourceRepository, ResourceRepository>();
        services.AddScoped<IBookingRepository, BookingRepository>();
        
        return services;
    }
}