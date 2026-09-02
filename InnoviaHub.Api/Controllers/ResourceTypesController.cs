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
        var rts = await resourceTypeService.GetAllResourceTypes();
        return Ok(rts);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var rt = await resourceTypeService.GetResourceTypeById(id);

        if (rt is null)
            return NotFound();
        
        return Ok(rt);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ResourceTypeDto resourceType)
    {
        var rt = await resourceTypeService.CreateResourceType(resourceType);
        return Ok(rt);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] ResourceTypeDto resourceType)
    {
        await resourceTypeService.UpdateResourceType(id, resourceType);
        return Ok();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await resourceTypeService.DeleteResourceType(id);
        return Ok();
    }
}