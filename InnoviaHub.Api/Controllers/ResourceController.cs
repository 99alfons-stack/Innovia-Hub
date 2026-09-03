using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.Shared.DTOs.Resource;
using Microsoft.AspNetCore.Mvc;

namespace InnoviaHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResourceController(IResourceService resourceService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var resource = await resourceService.GetAllAsync();
        return Ok(resource);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var resource = await resourceService.GetByIdAsync(id);
        
        if (resource is null)
            return NotFound();
        
        return Ok(resource);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateResourceDto dto)
    {
        var resource = await resourceService.CreateAsync(dto);
        return Ok(resource);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateResourceDto dto)
    {
        await resourceService.UpdateAsync(id, dto);
        return Ok();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await resourceService.DeleteAsync(id);
        return Ok();
    }
}