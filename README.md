# Gym Management API

REST API para la gestión de un gimnasio construido con Node.js y Express.

---

## Características
- Autenticación con JWT
- Password hashing con bcryptjs
- Testing automatizado con Jest y Supertest
- Arquitectura Modular

---

## Tecnologias
- Node.js
- Express
- MySQL (proximamente)
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

```bash
npm test
```

Verbose mode:

```bash
npm test -- --runInBand --verbose
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
├── middlewares/
│   └── authMiddleware.js
│
├── modules/
│   └── auth/
│       ├── authController.js
│       ├── authModel.js
│       ├── authRouter.js
│       └── authService.js
│
├── utils/
│   └── jwtUtils.js
│
├── app.js
├── server.js

test/
```

--- 

## Futuras implementaciones
- Integración de MySQL
- DataBase mocking para tests
- Uso de roles y permisos
- Gestion de clientes