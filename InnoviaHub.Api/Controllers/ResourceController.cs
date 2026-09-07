using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.Shared.DTOs.Resource;
using InnoviaHub.Shared.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InnoviaHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ResourceController(IResourceService resourceService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ResourceDto>>> GetAll()
    {
        var resource = await resourceService.GetAllAsync();
        return Ok(resource);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ResourceDto>> GetById(Guid id)
    {
        var resource = await resourceService.GetByIdAsync(id);
        
        if (resource is null)
            return NotFound();
        
        return Ok(resource);
    }
    
    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpPost]
    public async Task<ActionResult<ResourceDto>> Create([FromBody] CreateResourceDto dto)
    {
        var resource = await resourceService.CreateAsync(dto);
        return CreatedAtAction(
            nameof(GetById), 
            new { id = resource.Id },
            resource
        );
    }
    
    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ResourceDto>> Update([FromRoute] Guid id, [FromBody] UpdateResourceDto dto)
    {
        var resource = await resourceService.UpdateAsync(id, dto);
        return Ok(resource);
    }

    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await resourceService.DeleteAsync(id);
        return NoContent();
    }
}