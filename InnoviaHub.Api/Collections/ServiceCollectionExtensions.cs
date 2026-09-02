using InnoviaHub.Api.Services;
using InnoviaHub.Api.Services.Interfaces;

namespace InnoviaHub.Api.Collections;

// Samlingspunkt för alla services
// Lägg in services här i en service.AddScoped<Interface, Klass>
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAuthService, AuthService>();
        
        return services;
    }
}