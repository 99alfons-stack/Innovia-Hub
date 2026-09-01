using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using InnoviaHub.Shared.DTOs.User;

namespace InnoviaHub.Api.Services;

public class UserService(IUserRepository repository) : IUserService
{
    public async Task<IEnumerable<UserDto>> GetAllUsers()
    {
        var users = await repository.GetAllUsers();

        return users.Select(user => new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsAdmin = user.IsAdmin
        });
    }

    public async Task<UserDto?> GetUserById(Guid userId)
    {
        var user = await repository.GetUserById(userId);
        
        if (user is null)
            return null;

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsAdmin = user.IsAdmin
        };
    }

    public async Task<UserDto> CreateUser(CreateUserDto dto)
    {
        var existingUser = await repository.GetUserByEmail(dto.Email);
        
        if (existingUser is not null)
            throw new InvalidOperationException("User already exists");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Password = dto.Password,
            IsAdmin = false
        };
        
        await repository.AddUser(user);

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsAdmin = user.IsAdmin
        };
    }

    public async Task<UserDto?> UpdateUser(Guid userId, UpdateUserDto dto)
    {
        var user = await repository.GetUserById(userId);
        
        if (user is null)
            return null;
        
        user.Email = dto.Email;
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        
        await repository.UpdateUser(user);

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsAdmin = user.IsAdmin
        };
    }

    public async Task<bool> DeleteUser(Guid userId)
    {
        var user = await repository.GetUserById(userId);

        if (user is null)
            return false;
        
        await repository.DeleteUser(user);
        return true;
    }
}