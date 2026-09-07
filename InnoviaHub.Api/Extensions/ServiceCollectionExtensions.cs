using InnoviaHub.Api.Services;
using InnoviaHub.Api.Services.Interfaces;

namespace InnoviaHub.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IResourceTypeService, ResourceTypeService>();
        services.AddScoped<IResourceService, ResourceService>();
        services.AddScoped<IBookingService, BookingService>();
        
        return services;
    }
}