using InnoviaHub.Api.Services;
using InnoviaHub.Api.Services.Interfaces;
using InnoviaHub.DataAccess;
using InnoviaHub.DataAccess.Repositories;
using InnoviaHub.DataAccess.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("SQL_ConnectionString")
    ?? throw new InvalidOperationException("SQL_ConnectionString environment variable is missing");

builder.Services.AddDbContext<InnoviaHubDbContext>(options =>
    options.UseNpgsql(connectionString));

//Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

//Services
builder.Services.AddScoped<IUserService, UserService>();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
