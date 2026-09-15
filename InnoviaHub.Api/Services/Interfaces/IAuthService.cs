using System.Security.Claims;
using InnoviaHub.Shared.DTOs.Auth;
using InnoviaHub.Shared.DTOs.User;

namespace InnoviaHub.Api.Services.Interfaces;

public interface IAuthService
{
    Task<UserDto?> GetCurrentUserAsync(ClaimsPrincipal principal);
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
    Task<bool> ChangePasswordAsync(ClaimsPrincipal principal, ChangePasswordDto dto);
    Task LogoutAsync();
}