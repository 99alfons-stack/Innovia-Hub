using InnoviaHub.Api.Mappings;
using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.DataAccess.Entities;
using InnoviaHub.Shared.DTOs.User;
using InnoviaHub.Shared.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InnoviaHub.Api.Services;

public class UserService(UserManager<User> userManager) : IUserService
{
    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await userManager.Users.ToListAsync();
        
        var result = new List<UserDto>();

        foreach (var user in users)
        {
            var isAdmin = await userManager.IsInRoleAsync(user, nameof(UserRoles.Admin));
            result.Add(user.ToDto(isAdmin));
        }
        
        return result;
    }

    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        
        if (user is null)
            return null;
        
        var isAdmin = await userManager.IsInRoleAsync(user, nameof(UserRoles.Admin));
        
        return user.ToDto(isAdmin);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var existingUser = await userManager.FindByEmailAsync(dto.Email);
        
        if (existingUser is not null)
            throw new InvalidOperationException("USER_ALREADY_EXISTS");

        var user = new User
        {
            Id = Guid.NewGuid(),
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
        };
        
        var result = await userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
            throw new InvalidOperationException("COULD_NOT_CREATE_USER");
        
        var role = await userManager.AddToRoleAsync(user, nameof(UserRoles.Member));
        
        if (!role.Succeeded)
            throw new InvalidOperationException("COULD_NOT_ASSIGN_ROLE");

        return user.ToDto(false);
    }

    public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserDto dto)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        
        if (user is null)
            return null;
        
        user.UserName = dto.Email;
        user.Email = dto.Email;
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        
        var result = await userManager.UpdateAsync(user);
        
        if (!result.Succeeded)
            throw new InvalidOperationException("COULD_NOT_UPDATE_USER");
        
        var isAdmin = await userManager.IsInRoleAsync(user, nameof(UserRoles.Admin));

        return user.ToDto(isAdmin);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());

        if (user is null)
            return false;
        
        var result = await userManager.DeleteAsync(user);
        
        if (!result.Succeeded)
            throw new InvalidOperationException("COULD_NOT_DELETE_USER");
        
        return true;
    }
}