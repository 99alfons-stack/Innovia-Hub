using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.Shared.DTOs.ResourceType;
using InnoviaHub.Shared.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InnoviaHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ResourceTypesController(IResourceTypeService resourceTypeService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ResourceTypeDto>>> GetAll()
    {
        var rts = await resourceTypeService.GetAllAsync();
        return Ok(rts);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ResourceTypeDto>> GetById(Guid id)
    {
        var rt = await resourceTypeService.GetByIdAsync(id);

        if (rt is null)
            return NotFound();
        
        return Ok(rt);
    }
    
    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpPost]
    public async Task<ActionResult<ResourceTypeDto>> Create([FromBody] CreateResourceTypeDto resourceType)
    {
        var rt = await resourceTypeService.CreateAsync(resourceType);
        return CreatedAtAction(
            nameof(GetById),
            new { id = rt.Id },
            rt
        );
    }

    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ResourceTypeDto>> Update([FromRoute] Guid id, [FromBody] UpdateResourceTypeDto resourceType)
    {
        var rt = await resourceTypeService.UpdateAsync(id, resourceType);
        return Ok(rt);
    }

    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await resourceTypeService.DeleteAsync(id);
        return NoContent();
    }
}