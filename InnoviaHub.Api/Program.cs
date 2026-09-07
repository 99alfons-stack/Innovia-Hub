using InnoviaHub.Api.Data;
using InnoviaHub.Api.Collections;
using InnoviaHub.DataAccess;
using InnoviaHub.DataAccess.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using InnoviaHub.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
   options.AddPolicy("Frontend",policy =>
   {
       policy
       .WithOrigins("http://localhost:5173")
       .AllowAnyHeader()
       .AllowAnyMethod()
       .AllowCredentials();
   });
});

var connectionString = Environment.GetEnvironmentVariable("SQL_ConnectionString")
    ?? throw new InvalidOperationException("SQL_CONNECTION_STRING IS MISSING");

builder.Services.AddDbContext<InnoviaHubDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddIdentity<User, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<InnoviaHubDbContext>();

builder.Services.AddAuthorization();

builder.Services.AddApplicationServices();
builder.Services.AddApplicationRepositories();
builder.Services.AddSignalR();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    await IdentitySeeder.SeedRolesAsync(roleManager);
    await IdentitySeeder.SeedAdminAsync(userManager);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
