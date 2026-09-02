using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.Shared.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;

namespace InnoviaHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await authService.Login(dto);
        return Ok(result);
    }
}