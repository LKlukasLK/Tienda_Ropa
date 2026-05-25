import { PrismaClient, Rol, EstadoPedido, MetodoPago, TipoDescuento, TipoAplicacion } from "@prisma/client";
import bcrypt from "bcryptjs"; // <--- Asegúrate de que sea bcryptjs
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // ============================================================
  // LIMPIAR BD (orden inverso a las dependencias)
  // ============================================================
  await prisma.historialEstado.deleteMany();
  await prisma.detallePedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.carritoItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.descuentoProducto.deleteMany();
  await prisma.descuento.deleteMany();
  await prisma.direccion.deleteMany();
  await prisma.user.deleteMany();
  await prisma.varianteProducto.deleteMany();
  await prisma.imagenProducto.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();

  console.log("🧹 BD limpia");

  // ============================================================
  // CATEGORÍAS
  // ============================================================
  const [camisetas, pantalones, vestidos, abrigos, accesorios] = await Promise.all([
    prisma.categoria.create({ data: { nombre: "Camisetas",   slug: "camisetas"   } }),
    prisma.categoria.create({ data: { nombre: "Pantalones",  slug: "pantalones"  } }),
    prisma.categoria.create({ data: { nombre: "Vestidos",    slug: "vestidos"    } }),
    prisma.categoria.create({ data: { nombre: "Abrigos",     slug: "abrigos"     } }),
    prisma.categoria.create({ data: { nombre: "Accesorios",  slug: "accesorios"  } }),
  ]);

  console.log("📂 Categorías creadas");

  // ============================================================
  // PRODUCTOS + VARIANTES + IMÁGENES
  // ============================================================
  const productosData = [
    {
      nombre: "Camiseta Básica Blanca",
      descripcion: "Camiseta de algodón 100% orgánico, corte regular.",
      precio: 19.99,
      sku: "CAM-BAS-BL-001",
      categoriaId: camisetas.id,
      variantes: [
        { talla: "S",  color: "Blanco", stock: 20 },
        { talla: "M",  color: "Blanco", stock: 35 },
        { talla: "L",  color: "Blanco", stock: 25 },
        { talla: "XL", color: "Blanco", stock: 10 },
        { talla: "S",  color: "Negro",  stock: 18 },
        { talla: "M",  color: "Negro",  stock: 30 },
        { talla: "L",  color: "Negro",  stock: 22 },
      ],
      imagenes: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
      ],
    },
    {
      nombre: "Camiseta Oversize Lavada",
      descripcion: "Efecto lavado vintage, tejido grueso 280g.",
      precio: 29.99,
      sku: "CAM-OVR-GR-002",
      categoriaId: camisetas.id,
      variantes: [
        { talla: "S",  color: "Gris",   stock: 15 },
        { talla: "M",  color: "Gris",   stock: 28 },
        { talla: "L",  color: "Gris",   stock: 20 },
        { talla: "M",  color: "Beige",  stock: 12 },
        { talla: "L",  color: "Beige",  stock: 10 },
      ],
      imagenes: [
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
      ],
    },
    {
      nombre: "Pantalón Cargo Verde",
      descripcion: "Pantalón cargo con múltiples bolsillos, corte holgado.",
      precio: 59.99,
      sku: "PAN-CAR-VD-001",
      categoriaId: pantalones.id,
      variantes: [
        { talla: "36", color: "Verde Militar", stock: 8  },
        { talla: "38", color: "Verde Militar", stock: 14 },
        { talla: "40", color: "Verde Militar", stock: 12 },
        { talla: "42", color: "Verde Militar", stock: 6  },
        { talla: "38", color: "Negro",         stock: 10 },
        { talla: "40", color: "Negro",         stock: 9  },
      ],
      imagenes: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
      ],
    },
    {
      nombre: "Pantalón Lino Beige",
      descripcion: "Lino natural, perfecto para verano. Tiro medio.",
      precio: 49.99,
      sku: "PAN-LIN-BE-002",
      categoriaId: pantalones.id,
      variantes: [
        { talla: "36", color: "Beige", stock: 10 },
        { talla: "38", color: "Beige", stock: 18 },
        { talla: "40", color: "Beige", stock: 14 },
        { talla: "42", color: "Beige", stock: 7  },
      ],
      imagenes: [
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
      ],
    },
    {
      nombre: "Vestido Midi Floral",
      descripcion: "Vestido midi con estampado floral, tirantes finos.",
      precio: 69.99,
      sku: "VES-MID-FL-001",
      categoriaId: vestidos.id,
      variantes: [
        { talla: "XS", color: "Floral Rosa",  stock: 6  },
        { talla: "S",  color: "Floral Rosa",  stock: 12 },
        { talla: "M",  color: "Floral Rosa",  stock: 10 },
        { talla: "L",  color: "Floral Rosa",  stock: 5  },
        { talla: "S",  color: "Floral Azul",  stock: 8  },
        { talla: "M",  color: "Floral Azul",  stock: 7  },
      ],
      imagenes: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
        "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800",
      ],
    },
    {
      nombre: "Abrigo Oversize Camel",
      descripcion: "Abrigo de lana mezcla, corte oversize, forro interior.",
      precio: 149.99,
      sku: "ABR-OVR-CA-001",
      categoriaId: abrigos.id,
      variantes: [
        { talla: "S",  color: "Camel", stock: 5  },
        { talla: "M",  color: "Camel", stock: 8  },
        { talla: "L",  color: "Camel", stock: 6  },
        { talla: "XL", color: "Camel", stock: 3  },
        { talla: "S",  color: "Negro", stock: 4  },
        { talla: "M",  color: "Negro", stock: 7  },
        { talla: "L",  color: "Negro", stock: 5  },
      ],
      imagenes: [
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
      ],
    },
    {
      nombre: "Gorra Bucket Negra",
      descripcion: "Gorra tipo bucket, tela 100% algodón.",
      precio: 22.99,
      sku: "ACC-BUC-NE-001",
      categoriaId: accesorios.id,
      variantes: [
        { talla: "Única", color: "Negro",  stock: 40 },
        { talla: "Única", color: "Beige",  stock: 35 },
        { talla: "Única", color: "Blanco", stock: 20 },
      ],
      imagenes: [
        "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800",
      ],
    },
  ];

  const productosCreados = [];
  for (const p of productosData) {
    const producto = await prisma.producto.create({
      data: {
        nombre:      p.nombre,
        descripcion: p.descripcion,
        precio:      p.precio,
        sku:         p.sku,
        categoriaId: p.categoriaId,
        imagen:      p.imagenes[0],
        imagenes: {
          create: p.imagenes.map((url, i) => ({ url, orden: i })),
        },
        variantes: {
          create: p.variantes,
        },
      },
      include: { variantes: true },
    });
    productosCreados.push(producto);
  }

  console.log(`👕 ${productosCreados.length} productos creados`);

  // ============================================================
  // DESCUENTOS
  // ============================================================
  const cuponVerano = await prisma.descuento.create({
    data: {
      nombre:      "Cupón Verano 2025",
      codigo:      "VERANO15",
      tipo:        TipoDescuento.PORCENTAJE,
      aplicacion:  TipoAplicacion.CUPON,
      valor:       15,
      minCompra:   50,
      maxUsos:     200,
      activo:      true,
      inicio:      new Date("2025-06-01"),
      fin:         new Date("2025-08-31"),
    },
  });

  const descuentoBienvenida = await prisma.descuento.create({
    data: {
      nombre:     "Bienvenida 10€",
      codigo:     "WELCOME10",
      tipo:       TipoDescuento.MONTO_FIJO,
      aplicacion: TipoAplicacion.CUPON,
      valor:      10,
      minCompra:  40,
      maxUsos:    1000,
      activo:     true,
    },
  });

  // Descuento automático en abrigos (rebajas de temporada)
  const rebajasAbrigos = await prisma.descuento.create({
    data: {
      nombre:     "Rebajas Abrigos Enero",
      tipo:       TipoDescuento.PORCENTAJE,
      aplicacion: TipoAplicacion.AUTOMATICO,
      valor:      30,
      activo:     true,
      inicio:     new Date("2025-01-07"),
      fin:        new Date("2025-02-28"),
      productos: {
        create: productosCreados
          .filter(p => p.nombre.includes("Abrigo"))
          .map(p => ({ productoId: p.id })),
      },
    },
  });

  console.log("🏷️  Descuentos creados");

  // ============================================================
  // USUARIOS
  // ============================================================
  const hashAdmin  = await bcrypt.hash("Admin1234!", 10);
  const hashUser1  = await bcrypt.hash("User1234!",  10);
  const hashUser2  = await bcrypt.hash("User5678!",  10);
  const hashEditor = await bcrypt.hash("Edit1234!",  10);

  const admin = await prisma.user.create({
    data: {
      nombre:    "Carlos",
      apellidos: "García López",
      email:     "admin@tienda.com",
      password:  hashAdmin,
      rol:       Rol.ADMIN,
      telefono:  "+34 600 111 222",
      direcciones: {
        create: {
          titulo:       "Oficina",
          calle:        "Calle Gran Vía 45, 3ºA",
          ciudad:       "Madrid",
          codigoPostal: "28013",
        },
      },
    },
    include: { direcciones: true },
  });

  const editor = await prisma.user.create({
    data: {
      nombre:    "Laura",
      apellidos: "Martínez Ruiz",
      email:     "editor@tienda.com",
      password:  hashEditor,
      rol:       Rol.EDITOR,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      nombre:    "Ana",
      apellidos: "Sánchez Torres",
      email:     "ana@example.com",
      password:  hashUser1,
      telefono:  "+34 611 333 444",
      direcciones: {
        create: [
          {
            titulo:       "Mi casa",
            calle:        "Av. de la Constitución 12, 2ºB",
            ciudad:       "Sevilla",
            codigoPostal: "41001",
          },
          {
            titulo:       "Trabajo",
            calle:        "Calle Sierpes 30, 1ºA",
            ciudad:       "Sevilla",
            codigoPostal: "41004",
          },
        ],
      },
    },
    include: { direcciones: true },
  });

  const user2 = await prisma.user.create({
    data: {
      nombre:    "Miguel",
      apellidos: "Fernández Vega",
      email:     "miguel@example.com",
      password:  hashUser2,
      telefono:  "+34 622 555 666",
      direcciones: {
        create: {
          titulo:       "Casa",
          calle:        "Calle Diagonal 200, 5ºC",
          ciudad:       "Barcelona",
          codigoPostal: "08013",
        },
      },
    },
    include: { direcciones: true },
  });

  console.log("👤 Usuarios creados");

  // ============================================================
  // WISHLIST
  // ============================================================
  const vestidoMidi = productosCreados.find(p => p.nombre.includes("Vestido"))!;
  const abrigoOvr  = productosCreados.find(p => p.nombre.includes("Abrigo"))!;
  const camBasica  = productosCreados.find(p => p.nombre.includes("Básica"))!;

  await prisma.wishlistItem.createMany({
    data: [
      { userId: user1.id, productoId: vestidoMidi.id },
      { userId: user1.id, productoId: abrigoOvr.id   },
      { userId: user2.id, productoId: camBasica.id   },
      { userId: user2.id, productoId: vestidoMidi.id },
    ],
  });

  console.log("❤️  Wishlist creada");

  // ============================================================
  // CARRITOS (persistentes / abandonados)
  // ============================================================
  const panCargo   = productosCreados.find(p => p.nombre.includes("Cargo"))!;
  const gorraBlack = productosCreados.find(p => p.nombre.includes("Gorra"))!;

  // Carrito de user1: tiene items pero no ha comprado todavía
  const variantePanCargo38 = panCargo.variantes.find(v => v.talla === "38" && v.color === "Verde Militar")!;
  const varianteGorraNegra = gorraBlack.variantes.find(v => v.color === "Negro")!;

  await prisma.carritoItem.createMany({
    data: [
      { userId: user1.id, varianteId: variantePanCargo38.id, cantidad: 1 },
      { userId: user1.id, varianteId: varianteGorraNegra.id, cantidad: 2 },
    ],
  });

  // Carrito de user2: una camiseta básica en negro talla M
  const camNegrM = camBasica.variantes.find(v => v.talla === "M" && v.color === "Negro")!;
  await prisma.carritoItem.create({
    data: { userId: user2.id, varianteId: camNegrM.id, cantidad: 1 },
  });

  console.log("🛒 Carritos creados");

  // ============================================================
  // PEDIDOS
  // ============================================================

  // --- Pedido 1: user1, ENTREGADO, con cupón VERANO15 ---
  const varianteVestidoS  = vestidoMidi.variantes.find(v => v.talla === "S"  && v.color === "Floral Rosa")!;
  const varianteAbrigoM   = abrigoOvr.variantes.find(v  => v.talla === "M"  && v.color === "Camel")!;
  const dir1              = user1.direcciones[0];

  const pedido1 = await prisma.pedido.create({
    data: {
      nroPedido:          "SHOP-10001",
      total:              193.48,   // (69.99 + 149.99) - 15% cupón
      descuento:          33.00,
      metodoPago:         MetodoPago.STRIPE,
      estado:             EstadoPedido.ENTREGADO,
      userId:             user1.id,
      descuentoId:        cuponVerano.id,
      envio_titulo:       dir1.titulo,
      envio_calle:        dir1.calle,
      envio_ciudad:       dir1.ciudad,
      envio_codigoPostal: dir1.codigoPostal,
      detalles: {
        create: [
          { cantidad: 1, precioUnit: 69.99,  varianteId: varianteVestidoS.id },
          { cantidad: 1, precioUnit: 149.99, varianteId: varianteAbrigoM.id  },
        ],
      },
      historial: {
        create: [
          { estado: EstadoPedido.PENDIENTE,  createdAt: new Date("2025-07-10T10:00:00Z") },
          { estado: EstadoPedido.PAGADO,     createdAt: new Date("2025-07-10T10:05:00Z") },
          { estado: EstadoPedido.ENVIADO,    createdAt: new Date("2025-07-11T09:00:00Z"), nota: "Número de seguimiento: ES987654321ES" },
          { estado: EstadoPedido.ENTREGADO,  createdAt: new Date("2025-07-13T14:30:00Z") },
        ],
      },
    },
  });

  // --- Pedido 2: user2, ENVIADO, sin cupón ---
  const varianteCamBlancoM  = camBasica.variantes.find(v => v.talla === "M" && v.color === "Blanco")!;
  const variantePanLino38   = productosCreados.find(p => p.nombre.includes("Lino"))!.variantes.find(v => v.talla === "38")!;
  const dir2                = user2.direcciones[0];

  const pedido2 = await prisma.pedido.create({
    data: {
      nroPedido:          "SHOP-10002",
      total:              69.98,
      descuento:          0,
      metodoPago:         MetodoPago.PAYPAL,
      estado:             EstadoPedido.ENVIADO,
      userId:             user2.id,
      envio_titulo:       dir2.titulo,
      envio_calle:        dir2.calle,
      envio_ciudad:       dir2.ciudad,
      envio_codigoPostal: dir2.codigoPostal,
      detalles: {
        create: [
          { cantidad: 2, precioUnit: 19.99, varianteId: varianteCamBlancoM.id },
          { cantidad: 1, precioUnit: 49.99, varianteId: variantePanLino38.id  },
        ],
      },
      historial: {
        create: [
          { estado: EstadoPedido.PENDIENTE, createdAt: new Date("2025-09-01T08:00:00Z") },
          { estado: EstadoPedido.PAGADO,    createdAt: new Date("2025-09-01T08:10:00Z") },
          { estado: EstadoPedido.ENVIADO,   createdAt: new Date("2025-09-02T10:00:00Z"), nota: "Número de seguimiento: ES123456789ES" },
        ],
      },
    },
  });

  // --- Pedido 3: user1, PENDIENTE (recién creado) ---
  const varianteGorraBeige = gorraBlack.variantes.find(v => v.color === "Beige")!;
  const varianteCamOvrM    = productosCreados.find(p => p.nombre.includes("Oversize"))!.variantes.find(v => v.talla === "M" && v.color === "Gris")!;

  const pedido3 = await prisma.pedido.create({
    data: {
      nroPedido:          "SHOP-10003",
      total:              43.98,
      descuento:          0,
      metodoPago:         MetodoPago.STRIPE,
      estado:             EstadoPedido.PENDIENTE,
      userId:             user1.id,
      envio_titulo:       user1.direcciones[1].titulo,
      envio_calle:        user1.direcciones[1].calle,
      envio_ciudad:       user1.direcciones[1].ciudad,
      envio_codigoPostal: user1.direcciones[1].codigoPostal,
      detalles: {
        create: [
          { cantidad: 1, precioUnit: 22.99, varianteId: varianteGorraBeige.id },
          { cantidad: 1, precioUnit: 29.99, varianteId: varianteCamOvrM.id    },
        ],
      },
      historial: {
        create: [
          { estado: EstadoPedido.PENDIENTE },
        ],
      },
    },
  });

  console.log("📦 Pedidos creados");

  // ============================================================
  // RESUMEN FINAL
  // ============================================================
  console.log("\n✅ Seed completado con éxito:");
  console.log(`   • ${await prisma.categoria.count()}        categorías`);
  console.log(`   • ${await prisma.producto.count()}         productos`);
  console.log(`   • ${await prisma.varianteProducto.count()} variantes`);
  console.log(`   • ${await prisma.descuento.count()}        descuentos`);
  console.log(`   • ${await prisma.user.count()}             usuarios`);
  console.log(`   • ${await prisma.pedido.count()}           pedidos`);
  console.log(`   • ${await prisma.carritoItem.count()}      items en carrito`);
  console.log(`   • ${await prisma.wishlistItem.count()}     items en wishlist`);
  console.log("\n🔑 Credenciales:");
  console.log("   admin@tienda.com  / Admin1234!  (ADMIN)");
  console.log("   editor@tienda.com / Edit1234!   (EDITOR)");
  console.log("   ana@example.com   / User1234!   (USER)");
  console.log("   miguel@example.com/ User5678!   (USER)");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });