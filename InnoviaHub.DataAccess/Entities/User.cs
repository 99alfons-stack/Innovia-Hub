using Microsoft.AspNetCore.Identity;

namespace InnoviaHub.DataAccess.Entities;

public class User : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } =  string.Empty;
    public bool MustChangePassword { get; set; }
}