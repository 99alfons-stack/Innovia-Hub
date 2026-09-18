using InnoviaHub.DataAccess.Entities;
using InnoviaHub.Shared.Enums;
using Microsoft.AspNetCore.Identity;

namespace InnoviaHub.Api.Data;

public static class IdentitySeeder
{
    public static async Task SeedRolesAsync(
    RoleManager<IdentityRole<Guid>> roleManager
    IConfiguration configuration)
    {
        foreach (var role in Enum.GetValues<UserRoles>())
        {
            var roleName = role.ToString();

            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            }
        }
    }

    public static async Task SeedAdminAsync(UserManager<User> userManager)
    {
        var admins = await userManager.GetUsersInRoleAsync(UserRoles.Admin.ToString());
        
        if (admins.Any())
            return;
        
        var email = configuration["ADMIN_EMAIL"];
        var password = configuration["ADMIN_PASSWORD"];

        if (string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(password))
        {
            return;
        }

        var existingUser = await userManager.FindByEmailAsync(email);

        if (existingUser is not null)
            return;

        var admin = new User
        {
            Id = Guid.NewGuid(),
            UserName = email,
            Email = email,
            FirstName = "Admin",
            LastName = "User"
        };

        var result = await userManager.CreateAsync(admin, password);

        if (!result.Succeeded)
        {
            var errors = string.Join(
                ", ",
                result.Errors.Select(x => x.Description)
            );

            throw new InvalidOperationException(errors);
        }

        await userManager.AddToRoleAsync(
            admin,
            UserRoles.Admin.ToString()
        );
    }
}