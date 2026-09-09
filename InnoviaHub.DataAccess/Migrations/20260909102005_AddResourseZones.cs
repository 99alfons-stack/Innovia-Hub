using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InnoviaHub.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddResourseZones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Zone",
                table: "Resources",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Zone",
                table: "Resources");
        }
    }
}
