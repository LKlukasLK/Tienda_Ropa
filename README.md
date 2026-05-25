# MODASHOP - Tienda de Ropa Online

Aplicación web full-stack de comercio electrónico para la venta de ropa.

## Tecnologías

### Frontend
- **React 19** + **TypeScript**
- **Vite 8** (bundler)
- **Tailwind CSS 4** (estilos)
- **Zustand 5** (estado global)
- **React Router DOM 7** (enrutamiento)
- **Lucide React** (iconos)
- **Stripe** (pagos)

### Backend
- **Node.js** + **Express 5**
- **TypeScript**
- **Prisma 6** (ORM)
- **PostgreSQL** (base de datos en Supabase)
- **Supabase Storage** (imágenes)
- **Stripe API + Webhooks** (pagos)
- **JWT + bcryptjs** (autenticación)
- **Zod 4** (validación)
- **Jest + Supertest** (tests)

## Estructura del Proyecto

```
Tienda_Ropa/
├── Backend/
│   └── src/
│       ├── index.ts                  # Servidor Express
│       ├── controllers/             # Lógica de negocio
│       │   ├── auth.controller.ts
│       │   ├── carrito.controller.ts
│       │   ├── pago.controller.ts
│       │   ├── pedido.controller.ts
│       │   ├── producto.controller.ts
│       │   └── user.controller.ts
│       ├── routes/                  # Definición de rutas API
│       ├── middlewares/             # Auth, validación, errores
│       ├── lib/                     # Prisma, Stripe, Supabase
│       └── schemas/                 # Esquemas Zod
├── Frontend/
│   └── src/
│       ├── App.tsx                  # Router principal
│       ├── components/             # Componentes reutilizables
│       │   ├── BarraNavegacion.tsx  # Navbar
│       │   ├── PiePagina.tsx       # Footer
│       │   ├── Notificacion.tsx    # Popup de alertas
│       │   ├── TarjetaProducto.tsx # Card de producto
│       │   └── FormularioPago.tsx  # Formulario Stripe
│       ├── pages/                  # Páginas de la app
│       │   ├── Inicio.tsx          # Landing page
│       │   ├── Coleccion.tsx       # Todos los productos + filtros
│       │   ├── DetalleProducto.tsx # Vista detalle del producto
│       │   ├── Carrito.tsx         # Carrito de compra
│       │   ├── ProcesarPago.tsx    # Checkout Stripe
│       │   ├── IniciarSesion.tsx   # Login
│       │   ├── MiPerfil.tsx        # Perfil de usuario
│       │   ├── SobreNosotros.tsx   # Página corporativa
│       │   └── PagoExitoso.tsx     # Confirmación de pago
│       ├── store/                  # Zustand stores
│       ├── services/               # Llamadas API
│       ├── types/                  # Interfaces TypeScript
│       └── api/                    # Axios instance
```

## Funcionalidades

### Usuario
- Registro e inicio de sesión con JWT
- Perfil con edición de datos personales
- Gestión de direcciones de envío
- Cambio de contraseña

### Productos
- Catálogo completo con paginación
- Filtros por: categoría, color, talla, precio, búsqueda por texto
- Vista detalle con selección de talla
- Galería de imágenes

### Carrito y Pedidos
- Carrito persistente en servidor
- Sincronización en tiempo real con Zustand
- Proceso de compra con Stripe
- Historial de pedidos

### Diseño
- Responsive (móvil, tablet, escritorio)
- Menú hamburguesa en móvil con panel de navegación
- Sidebar de filtros adaptable
- Paleta de colores: índigo + blanco/gris

## API Endpoints

### Públicos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productos` | Listar productos (con filtros) |
| GET | `/api/productos/filtros` | Opciones para filtros |
| GET | `/api/productos/:id` | Detalle del producto |
| GET | `/api/categorias` | Listar categorías |

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### Usuario (requiere auth)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios/perfil` | Obtener perfil |
| PATCH | `/api/usuarios/perfil` | Actualizar datos |
| PUT | `/api/usuarios/password` | Cambiar contraseña |
| POST | `/api/usuarios/direcciones` | Añadir dirección |
| DELETE | `/api/usuarios/direcciones/:id` | Eliminar dirección |

### Carrito (requiere auth)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/carrito` | Ver carrito |
| POST | `/api/carrito` | Añadir item |
| DELETE | `/api/carrito/:id` | Eliminar item |
| DELETE | `/api/carrito` | Vaciar carrito |

### Pedidos (requiere auth)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/pedidos` | Crear pedido |
| GET | `/api/pedidos` | Historial de pedidos |

### Pagos
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/pagos/crear-intento` | Crear intento de pago Stripe |

## Instalación

```bash
# Backend
cd Backend
npm install
cp .env.example .env   # Configurar variables
npx prisma migrate dev
npm run dev

# Frontend
cd Frontend
npm install
cp .env.example .env   # Configurar VITE_STRIPE_PUBLIC_KEY
npm run dev
```

## Variables de Entorno

### Backend (.env)
```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=tu_secreto
STRIPE_SECRET_KEY=sk_test_...
SUPABASE_URL=https://...
SUPABASE_KEY=...
```

### Frontend (.env)
```
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Modelo de Datos

- **User**: id, nombre, apellidos, email, password, rol, teléfono, avatar
- **Producto**: nombre, descripción, precio, SKU, imagen, categoría
- **VarianteProducto**: talla, color, stock (por producto)
- **Categoria**: nombre, slug
- **Pedido**: total, estado, dirección de envío, usuario
- **CarritoItem**: cantidad, variante, usuario
- **Direccion**: título, calle, ciudad, código postal
- **WishlistItem**: producto favorito por usuario
