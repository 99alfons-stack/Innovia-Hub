using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.Shared.DTOs.Auth;
using InnoviaHub.Shared.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InnoviaHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [Authorize]
    [HttpGet("current-user")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var result = await authService.GetCurrentUserAsync(User);

        if (result is null)
            return Unauthorized();

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto dto)
    {
        var result = await authService.LoginAsync(dto);

        if (result is null)
            return Unauthorized();

        return Ok(result);
    }
    //Password change for Users

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var result = await authService.ChangePasswordAsync(User, dto);

        if (!result)
            return BadRequest("Lösenordet kunde inte ändras.");

        return NoContent();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await authService.LogoutAsync();

        return NoContent();
    }
}