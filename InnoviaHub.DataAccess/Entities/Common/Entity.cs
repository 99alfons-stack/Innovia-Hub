namespace InnoviaHub.DataAccess.Entities.Common;

public abstract class Entity<TId>
{
    public TId Id { get; set; }
}