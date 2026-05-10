# Backend - Tienda de Ropa

API REST para una tienda de ropa hecha con Express, TypeScript, Prisma y PostgreSQL. Incluye autenticacion con JWT, catalogo de productos, categorias, carrito, wishlist, pedidos, subida de imagenes con Supabase Storage y pagos con Stripe.

## Tecnologias

- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Supabase Storage
- Stripe
- Jest + Supertest

## Requisitos

- Node.js instalado
- Una base de datos PostgreSQL
- Credenciales de Supabase si se van a subir imagenes
- Clave secreta de Stripe si se van a probar pagos

## Instalacion

Desde la carpeta `Backend`:

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en `Backend` con las variables necesarias:

```env
PORT=3000
NODE_ENV=development

DIRECT_URL="postgresql://usuario:password@host:puerto/base_de_datos"

JWT_SECRET="cambia_esta_clave_en_desarrollo"

SUPABASE_URL="https://tu-proyecto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key"

STRIPE_SECRET_KEY="sk_test_..."
```

Notas:

- `DIRECT_URL` es la URL que usa Prisma para conectarse a PostgreSQL.
- `JWT_SECRET` se usa para firmar y validar tokens.
- `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` son necesarios para la subida de imagenes.
- `STRIPE_SECRET_KEY` es necesaria para crear intentos de pago.

## Base de datos

Genera el cliente de Prisma:

```bash
npx prisma generate
```

Aplica las migraciones:

```bash
npx prisma migrate dev
```

Carga datos de prueba:

```bash
npx prisma db seed
```

El seed crea categorias, productos, variantes, usuarios, descuentos, carrito, wishlist y pedidos.

Credenciales de prueba incluidas en el seed:

| Rol | Email | Password |
| --- | --- | --- |
| ADMIN | `admin@tienda.com` | `Admin1234!` |
| EDITOR | `editor@tienda.com` | `Edit1234!` |
| USER | `ana@example.com` | `User1234!` |
| USER | `miguel@example.com` | `User5678!` |

## Ejecutar el servidor

```bash
npm run dev
```

Por defecto la API queda disponible en:

```text
http://localhost:3000
```

El CORS permite peticiones desde:

- `http://localhost:5173`
- `http://localhost:3000`

## Scripts

| Comando | Descripcion |
| --- | --- |
| `npm run dev` | Levanta el servidor en modo desarrollo con recarga automatica |
| `npm test` | Ejecuta Jest en modo watch |
| `npx prisma generate` | Genera Prisma Client |
| `npx prisma migrate dev` | Aplica migraciones en desarrollo |
| `npx prisma db seed` | Inserta datos iniciales |

## Endpoints principales

### Auth

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Registra un usuario |
| `POST` | `/api/auth/login` | Inicia sesion y devuelve un token JWT |

### Productos

| Metodo | Ruta | Proteccion | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/api/productos` | Publica | Lista productos |
| `GET` | `/api/productos/:id` | Publica | Obtiene un producto por ID |
| `GET` | `/api/productos/buscar/:sku` | Publica | Busca un producto por SKU |
| `POST` | `/api/productos` | ADMIN | Crea un producto |
| `POST` | `/api/productos/:id/galeria` | ADMIN | Sube hasta 5 imagenes al campo `fotos` |
| `DELETE` | `/api/productos/:id` | ADMIN | Desactiva un producto |

### Categorias

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/api/categorias` | Lista categorias con conteo de productos |
| `GET` | `/api/categorias/:slug` | Obtiene una categoria y sus productos activos |

### Usuarios

> En el codigo actual las rutas de usuario estan montadas como `/api/usarios`.

| Metodo | Ruta | Proteccion | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/api/usarios/perfil` | Usuario autenticado | Obtiene el perfil |
| `POST` | `/api/usarios/direcciones` | Usuario autenticado | Agrega una direccion |
| `DELETE` | `/api/usarios/direcciones/:id` | Usuario autenticado | Elimina una direccion |
| `GET` | `/api/usarios/wishlist` | Usuario autenticado | Lista la wishlist |
| `POST` | `/api/usarios/wishlist` | Usuario autenticado | Agrega o quita un producto de la wishlist |

### Carrito

Todas las rutas requieren autenticacion.

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/api/carrito` | Obtiene el carrito del usuario |
| `POST` | `/api/carrito` | Agrega un item al carrito |
| `DELETE` | `/api/carrito/:id` | Elimina un item |
| `DELETE` | `/api/carrito` | Vacia el carrito |

### Pedidos

| Metodo | Ruta | Proteccion | Descripcion |
| --- | --- | --- | --- |
| `POST` | `/api/pedidos` | Usuario autenticado | Crea un pedido |
| `GET` | `/api/pedidos/mis-pedidos` | Usuario autenticado | Lista los pedidos del usuario |
| `PATCH` | `/api/pedidos/:id/estado` | ADMIN | Actualiza el estado de un pedido |

### Pagos

| Metodo | Ruta | Proteccion | Descripcion |
| --- | --- | --- | --- |
| `POST` | `/api/pagos/crear-intento` | Usuario autenticado | Crea un intento de pago con Stripe |

## Autenticacion

Las rutas protegidas esperan un token JWT en el header:

```http
Authorization: Bearer TU_TOKEN
```

Puedes obtener el token haciendo login en:

```http
POST /api/auth/login
```

## Pruebas

```bash
npm test
```

El comando actual ejecuta Jest en modo watch. Para una ejecucion puntual se puede usar:

```bash
npx jest --runInBand
```

## Estructura del proyecto

```text
Backend/
  prisma/
    schema.prisma
    seed.ts
    migrations/
  src/
    controllers/
    lib/
    middlewares/
    routes/
    schemas/
    __test__/
    index.ts
```

## Observaciones

- El servidor no llama a `listen` cuando `NODE_ENV=test`, lo que permite probar la app con Supertest.
