using System.Security.Claims;
using InnoviaHub.Api.Mappings;
using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.DataAccess.Entities;
using InnoviaHub.Shared.DTOs.Auth;
using InnoviaHub.Shared.DTOs.User;
using Microsoft.AspNetCore.Identity;

namespace InnoviaHub.Api.Services;

public class AuthService(UserManager<User> userManager,
    SignInManager<User> signInManager) : IAuthService
{
    public async Task<UserDto?> GetCurrentUserAsync(ClaimsPrincipal principal)
    {
        var user = await userManager.GetUserAsync(principal);

        if (user is null)
            return null;
        
        var isAdmin = await userManager.IsInRoleAsync(user, "Admin");

        return user.ToDto(isAdmin);
    }
    
    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email);

        if (user is null)
            return null;

        var result = await signInManager.PasswordSignInAsync(
            user,
            dto.Password,
            false,
            false
        );
        
        if (!result.Succeeded)
            return null;
        
        var isAdmin = await userManager.IsInRoleAsync(user, "Admin");

        return user.ToLoginDto(isAdmin);
    }

    public async Task LogoutAsync()
    {
        await signInManager.SignOutAsync();
    }
}