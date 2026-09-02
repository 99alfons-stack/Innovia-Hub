using InnoviaHub.Shared.DTOs.Auth;

namespace InnoviaHub.Api.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> Login(LoginDto dto);
}