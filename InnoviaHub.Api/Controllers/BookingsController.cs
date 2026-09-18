using System.Security.Claims;
using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.Shared.DTOs.Booking;
using InnoviaHub.Shared.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InnoviaHub.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace InnoviaHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController(
    IBookingService bookingService,
    IHubContext<NotificationHub> hubContext) : ControllerBase
{
    private Guid GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userId, out var id))
            throw new UnauthorizedAccessException();
        
        return id;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetAll()
    {
        var booking = await bookingService.GetAllAsync();
        return Ok(booking);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingDto>> GetById(Guid id)
    {
        var booking = await bookingService.GetByIdAsync(id);
        
        if (booking == null)
            return NotFound();
        
        return Ok(booking);
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> Create([FromBody] CreateBookingDto dto)
    {
        var userId = GetCurrentUserId();

        var booking = await bookingService.CreateAsync(
            userId,
            dto
        );

        await hubContext.Clients.All.SendAsync(
            "BookingCreated",
            booking);

        return CreatedAtAction(
            nameof(GetById),
            new { id = booking.Id },
            booking);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BookingDto>> Update(Guid id, [FromBody] UpdateBookingDto dto)
    {
        var userId = GetCurrentUserId();
        var isAdmin = User.IsInRole(nameof(UserRoles.Admin));

        var booking = await bookingService.UpdateAsync(id, userId, isAdmin, dto);

        if (booking is null)
            return NotFound();
        
        return Ok(booking);
    }

    [HttpPatch("{id}/cancel")]
    public async Task<ActionResult> Cancel(Guid id)
    {
        var userId = GetCurrentUserId();
        var isAdmin = User.IsInRole(nameof(UserRoles.Admin));
        
        var cancelled = await bookingService.CancelAsync(id, userId, isAdmin);
        
        return Ok(cancelled);
    }

    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetCurrentUserId();
        var isAdmin = User.IsInRole(nameof(UserRoles.Admin));
        var deleted = await bookingService.DeleteAsync(id, userId, isAdmin);

        if (!deleted)
            return NotFound();
        
        return NoContent();
    }
}