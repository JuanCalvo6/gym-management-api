# Gym Management API

REST API para la gestión de un gimnasio construido con Node.js y Express.

---

## Características
- Autenticación con JWT
- Password hashing con bcryptjs
- Testing automatizado con Jest y Supertest
- Arquitectura Modular
- Conexión de DB MySQL
---

## Tecnologias
- Node.js
- Express
- MySQL (mysql2)
- JWT
- Bcryptjs
- Jest
- Supertest

---

## Instalación
Clonar el repositorio:

```bash
git clone https://github.com/JuanCalvo6/gym-management-api.git
```

Instalar dependencias:
```bash
npm install
```

---

## Variables de entorno
Crear el archivo '.env' en el directorio raiz.

```env
JWT_SECRET=YOUR_SECRET_KEY  
PORT=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

---

## Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm install
```

---

## Ejecutar tests

Ejecutar todos los tests:
```bash
npm test
```

Verbose mode:

```bash
npm test -- --runInBand --verbose
```

Ejecutar tests de integración:

```bash
npm test authIntegration.test.js
```

Ejecutar tests unitarios:

```bash
npm test authService.test.js
```

## API Endpoints

### Authentication 

| Método | Endpoint | Descripcion |
|---|---|---|
|POST | `/api/auth/login` | login de usuario |
|GET | `/api/auth/verify` | verificar JWT Token|
|POST | `/api/auth/logout` | logout de usuario |

---

## Autenticación

Rutas protegidas utilizando autenticación con JWT.

Ejemplo de header:

```http
Authorization: Bearer YOUR_TOKER
```

---

## Estructura del Proyecto

```text
src/
├── config/
│   └── db.js
│
├── middlewares/
│   └── authMiddleware.js
│
├── modules/
│   └── auth/
│       ├── authController.js
│       ├── authModel.js
│       ├── authRouter.js
│       ├── authService.js
│       └── authValidation.js
│
├── utils/
│   └── jwtUtils.js
│
├── app.js
├── server.js

test/
```
--- 

## Configuración DB
Importar el archivo SQL ubicado en:

```text
database/gimnasio.sql
```
--- 

## Testing
El proyecto incluye:
- Tests de integración utilizando Supertest
- Tests unitarios utilizando Jest mocks

### Test de integración 
Los tests de integración validan el flujo completo de la solicitud:
```text
Route → Controller → Service → Model → MySQL
```
### Test unitario
Los tests unitarios aislan la lógica de negocio simulando dependencias externas, como los modelos de base de datos.

--- 

## Futuras implementaciones
- Uso de roles y permisos
- Módulo de profesores
- Gestión de clientes
- Gestión de inscripciones
- Control de asistencias