using InnoviaHub.Shared.DTOs.User;

namespace InnoviaHub.Shared.DTOs.Auth;

public class LoginResponseDto
{
    public UserDto User { get; set; } = null!;
}