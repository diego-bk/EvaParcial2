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



## Apidog
<img width="886" height="558" alt="image" src="https://github.com/user-attachments/assets/56e3a8e4-0ad2-41af-8a52-c67a1e9a257f" />
<img width="886" height="558" alt="image" src="https://github.com/user-attachments/assets/043e22e4-e366-4cd4-9442-68a388be64d7" />
<img width="886" height="532" alt="image" src="https://github.com/user-attachments/assets/3b3923aa-b9a9-4375-8f82-89a200ce2e89" />
<img width="886" height="531" alt="image" src="https://github.com/user-attachments/assets/79c2dc7e-898d-4227-89b0-d26d62e62418" />
<img width="886" height="538" alt="image" src="https://github.com/user-attachments/assets/0360d551-f3aa-44c3-a4e2-8e6c5085fa5b" />
<img width="886" height="538" alt="image" src="https://github.com/user-attachments/assets/a104f705-a862-42a9-83a7-2e911d5bab3d" />
<img width="886" height="373" alt="image" src="https://github.com/user-attachments/assets/4f2939f6-50a1-4017-b985-bc792f6efba5" />
<img width="886" height="399" alt="image" src="https://github.com/user-attachments/assets/efca9dea-058e-4464-a0ce-b7c5324a8b76" />
<img width="886" height="343" alt="image" src="https://github.com/user-attachments/assets/0eec7e65-535f-49ec-b412-0bdecc335595" />

## Angular
<img width="1280" height="589" alt="image" src="https://github.com/user-attachments/assets/ed63c7bd-e398-4317-a9c9-e5d73afc2572" />
<img width="1297" height="596" alt="image" src="https://github.com/user-attachments/assets/2d798ca9-0ac3-45c9-ab8e-caf5edbabc3d" />
<img width="1290" height="599" alt="image" src="https://github.com/user-attachments/assets/442c638e-a389-4833-b53e-926baff5e8bc" />
<img width="1286" height="586" alt="image" src="https://github.com/user-attachments/assets/7958d11d-67a2-4841-a1d0-590028eb262f" />
<img width="1280" height="594" alt="image" src="https://github.com/user-attachments/assets/2854e5fd-30ce-4161-866d-9a87ff8f5d84" />
<img width="1291" height="580" alt="image" src="https://github.com/user-attachments/assets/a62b258e-197c-470d-a5cb-5be9fb079026" />
<img width="1279" height="575" alt="image" src="https://github.com/user-attachments/assets/ca229c43-f5c2-4d70-b827-68dace32e7b4" />
<img width="1273" height="580" alt="image" src="https://github.com/user-attachments/assets/b8853c7c-68e6-44f0-b426-6ba33c2ae32d" />
<img width="1286" height="586" alt="image" src="https://github.com/user-attachments/assets/9d4a26d4-90ee-49b5-86f0-50bafc86f63b" />
<img width="1265" height="591" alt="image" src="https://github.com/user-attachments/assets/9250a398-3ccf-48b6-9d8b-231962a3077e" />
<img width="1276" height="580" alt="image" src="https://github.com/user-attachments/assets/7637ca58-eff0-457b-8eae-ca0945ba3282" />
<img width="1277" height="587" alt="image" src="https://github.com/user-attachments/assets/c9529a43-9588-4464-9936-10b671fc146d" />
<img width="1272" height="582" alt="image" src="https://github.com/user-attachments/assets/31ed5dfa-c095-4818-b13a-65a8c46b3717" />
<img width="1280" height="585" alt="image" src="https://github.com/user-attachments/assets/8016ed71-4178-4a0e-b7e7-9bedd328916c" />
