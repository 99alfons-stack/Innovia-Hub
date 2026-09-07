using InnoviaHub.DataAccess.Entities;
using InnoviaHub.Shared.DTOs.Auth;
using InnoviaHub.Shared.DTOs.User;

namespace InnoviaHub.Api.Mappings;

public static class UserMapping
{
    public static UserDto ToDto(this User mdoel, bool isAdmin)
    {
        return new UserDto()
        {
            Id = mdoel.Id,
            Email = mdoel.Email ?? string.Empty,
            FirstName = mdoel.FirstName,
            LastName = mdoel.LastName,
            IsAdmin = isAdmin
        };
    }

    public static UserSummaryDto ToSummaryDto(this User mdoel)
    {
        return new UserSummaryDto
        {
            Id = mdoel.Id,
            Email = mdoel.Email ?? string.Empty,
            FirstName = mdoel.FirstName,
            LastName = mdoel.LastName,
        };
    }

    public static LoginResponseDto ToLoginDto(this User user, bool isAdmin)
    {
        return new LoginResponseDto
        {
            User = user.ToDto(isAdmin)
        };
    }
}