using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.Shared.DTOs.ResourceType;
using Microsoft.AspNetCore.Mvc;

namespace InnoviaHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResourceTypesController(IResourceTypeService resourceTypeService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var rts = await resourceTypeService.GetAllAsync();
        return Ok(rts);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var rt = await resourceTypeService.GetByIdAsync(id);

        if (rt is null)
            return NotFound();
        
        return Ok(rt);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ResourceTypeDto resourceType)
    {
        var rt = await resourceTypeService.CreateAsync(resourceType);
        return Ok(rt);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] ResourceTypeDto resourceType)
    {
        await resourceTypeService.UpdateAsync(id, resourceType);
        return Ok();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await resourceTypeService.DeleteAsync(id);
        return Ok();
    }
}