# Sistema de Gestión de Conferencias

Este proyecto es una API RESTful para la gestión de conferencias, asistentes y registros de asistencia, desarrollada con ASP.NET Core y Entity Framework Core.

## Requisitos Previos

- .NET 9.0 SDK
- SQL Server
- Postman (para pruebas)
- Visual Studio 2022 o Visual Studio Code

## Configuración y Ejecución

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd EvaParcial2
```

### 2. Configurar la Base de Datos

Edita el archivo `backend/backend/appsettings.json` para configurar la conexión a SQL Server según tu entorno:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=ConferenciasDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

### 3. Aplicar Migraciones

En la terminal, navega hasta la carpeta del proyecto y ejecuta:

```bash
cd backend/backend
dotnet ef database update
```

Si es la primera vez, puede ser necesario crear la migración inicial:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4. Ejecutar el Proyecto

```bash
dotnet run
```

La API estará disponible en: https://localhost:7001 y http://localhost:5001 (los puertos pueden variar según la configuración).

## Pruebas con Postman

### Autenticación

#### Login

- **URL**: `POST /api/Auth/login`
- **Body**:
```json
{
  "username": "Admin",
  "password": "Admin123!"
}
```
- **Respuesta**: Guarda el token JWT para usarlo en las siguientes peticiones.

### Usuarios

#### Obtener Todos los Usuarios

- **URL**: `GET /api/Usuarios`
- **Headers**: 
  - Authorization: Bearer {token}

#### Crear Usuario

- **URL**: `POST /api/Usuarios`
- **Headers**: 
  - Authorization: Bearer {token}
- **Body**:
```json
{
  "username": "usuario1",
  "password": "Password123!",
  "rol": "Usuario",
  "estado": true
}
```

### Conferencias

#### Obtener Todas las Conferencias

- **URL**: `GET /api/Conferencias`
- **Headers**: 
  - Authorization: Bearer {token}

#### Crear Conferencia

- **URL**: `POST /api/Conferencias`
- **Headers**: 
  - Authorization: Bearer {token}
- **Body**:
```json
{
  "nombre": "Conferencia de Tecnología 2023",
  "fecha": "2023-12-15T10:00:00",
  "ubicacion": "Centro de Convenciones",
  "descripcion": "Conferencia sobre las últimas tendencias tecnológicas"
}
```

### Asistentes

#### Obtener Todos los Asistentes

- **URL**: `GET /api/Asistentes`
- **Headers**: 
  - Authorization: Bearer {token}

#### Crear Asistente

- **URL**: `POST /api/Asistentes`
- **Headers**: 
  - Authorization: Bearer {token}
- **Body**:
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@ejemplo.com",
  "telefono": "1234567890"
}
```

### Registros de Asistencia

#### Obtener Todos los Registros

- **URL**: `GET /api/RegistrosAsistencia`
- **Headers**: 
  - Authorization: Bearer {token}

#### Crear Registro de Asistencia

- **URL**: `POST /api/RegistrosAsistencia`
- **Headers**: 
  - Authorization: Bearer {token}
- **Body**:
```json
{
  "conferencia_id": 1,
  "asistente_id": 1,
  "asistencia": true
}
```

#### Obtener Registros por Conferencia

- **URL**: `GET /api/RegistrosAsistencia/Conferencia/1`
- **Headers**: 
  - Authorization: Bearer {token}

## Notas Adicionales

- El sistema crea automáticamente un usuario administrador con las credenciales:
  - Username: Admin
  - Password: Admin123!
- Todos los endpoints (excepto login) requieren autenticación mediante JWT.
- El token JWT tiene una duración de 3 horas.

## Resolución de Problemas

### Conflictos de Dependencias

Si encuentras errores de degradación de paquetes como:
```
Advertencia como error: Degradación del paquete detectada: System.IdentityModel.Tokens.Jwt
```

Asegúrate de que estás utilizando la versión 8.0.1 o superior de System.IdentityModel.Tokens.Jwt en el archivo backend.csproj:

```xml
<PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="8.0.1" />
```