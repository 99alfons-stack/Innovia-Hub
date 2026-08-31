using InnoviaHub.DataAccess.Entities;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InnoviaHub.DataAccess.Repositories;

public class UserRepository(InnoviaHubDbContext context) : IUserRepository
{
    public async Task<User?> GetUserByEmail(string email)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserById(Guid id)
    {
        return await context.Users.FindAsync(id);
    }

    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await context.Users.ToListAsync();
    }

    public async Task AddUser(User user)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
    }

    public async Task UpdateUser(User user)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync();
    }

    public async Task DeleteUser(User user)
    {
        context.Users.Remove(user);
        await context.SaveChangesAsync();
    }
}