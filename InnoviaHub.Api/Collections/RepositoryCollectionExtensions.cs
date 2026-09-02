using InnoviaHub.DataAccess.Repositories;

namespace InnoviaHub.Api.Collections;

// Samlingspunkt för alla repositories
// Lägg in repositories här i en service.AddScoped<Interface, Klass>
public static class RepositoryCollectionExtensions
{
    public static IServiceCollection AddApplicationRepositories(this IServiceCollection services)
    {
        services.AddScoped<IBookingRepository, BookingRepository>();
        
        return services;
    }
}