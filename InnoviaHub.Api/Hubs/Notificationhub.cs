using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace InnoviaHub.Api.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    
}