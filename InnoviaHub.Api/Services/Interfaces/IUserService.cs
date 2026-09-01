using InnoviaHub.Shared.DTOs.User;

namespace InnoviaHub.Api.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsers();
    Task<UserDto?> GetUserById(Guid userId);
    Task<UserDto> CreateUser(CreateUserDto dto);
    Task<UserDto?> UpdateUser(Guid userId, UpdateUserDto dto);
    Task<bool> DeleteUser(Guid userId);
}