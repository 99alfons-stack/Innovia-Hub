# Innovia Hub

## Förutsättningar

- .NET SDK 10
- Node.js och npm
- Docker Desktop

## Starta projektet

Kör kommandona från projektets rotmapp.

### 1. Starta databasen

```powershell
$env:database = "innoviahub"
$env:username = "postgres"
$env:password = "postgres"
docker compose up -d
```

### 2. Konfigurera API:t

API:t använder PostgreSQL på port `5433` och kräver en connection string. Sätt variablerna i samma terminalfönster som API:t ska startas i:

```powershell
$env:SQL_ConnectionString = "Host=localhost;Port=5433;Database=innoviahub;Username=postgres;Password=postgres"
$env:ADMIN_EMAIL = "admin@innoviahub.se"
$env:ADMIN_PASSWORD = "Admin1234!"
```

`ADMIN_EMAIL` och `ADMIN_PASSWORD` är valfria och används för att skapa den första administratören.

Kör migrationerna och starta API:t:

```powershell
dotnet ef database update --project InnoviaHub.DataAccess --startup-project InnoviaHub.Api
dotnet run --project InnoviaHub.Api --launch-profile http
```

API:t körs på `http://localhost:5193`. OpenAPI/Scalar finns på `http://localhost:5193/scalar` i utvecklingsläge.

### 3. Starta klienten

Öppna ett nytt terminalfönster:

```powershell
Set-Location InnoviaHub.Client
npm install
npm run dev
```

Klienten körs normalt på `http://localhost:5173`.

## Vanliga kommandon

```powershell
# Stoppa databasen
docker compose down

# Bygg API:t
dotnet build InnoviaHub.slnx

# Bygg klienten
npm run build --prefix InnoviaHub.Client

# Kör lint på klienten
npm run lint --prefix InnoviaHub.Client
```

Om `dotnet ef` saknas, installera Entity Framework CLI

```powershell
dotnet tool install --global dotnet-ef
```

## Testa API:t

HTTP-anrop finns i `InnoviaHub.Api/Http`. De kan köras direkt från VS Code med REST Client-tillägget.