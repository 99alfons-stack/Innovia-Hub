using InnoviaHub.DataAccess.Entities;

namespace InnoviaHub.DataAccess.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetUserByEmail(string email);
    Task<User?> GetUserById(Guid id);
    Task<IEnumerable<User>> GetAllUsers();
    Task AddUser(User user);
    Task UpdateUser(User user);
    Task DeleteUser(User user);
}