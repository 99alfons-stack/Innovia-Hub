using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.DataAccess.Entities;
using InnoviaHub.Shared.DTOs.Auth;
using Microsoft.AspNetCore.Identity;

namespace InnoviaHub.Api.Services;

public class AuthService(UserManager<User> userManager,
    SignInManager<User> signInManager) : IAuthService
{
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

        return new LoginResponseDto
        {
            UserId = user.Id,
            Email = user.Email ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsAdmin = isAdmin
        };
    }
}