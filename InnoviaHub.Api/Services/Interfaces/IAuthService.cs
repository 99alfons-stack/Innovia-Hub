using System.Security.Claims;
using InnoviaHub.Shared.DTOs.Auth;

namespace InnoviaHub.Api.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> GetCurrentUserAsync(ClaimsPrincipal principal);
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
    Task LogoutAsync();
}