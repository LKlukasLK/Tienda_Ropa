import { Request, Response } from 'express'; // Importar Request
import prisma from '../lib/prisma'; // Importar prisma
import { supabase } from '../lib/supabase'

export const crearProducto = async (req: Request, res: Response) => {
  try {
    // Si req.body está vacío, avisamos de inmediato
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "El cuerpo de la petición está vacío o no es un JSON válido" });
    }

    const { nombre, descripcion, precio, sku, categoriaId, variantes } = req.body;

    // Validación básica manual antes de ir a Prisma
    if (!nombre || !precio || !sku || !categoriaId) {
      return res.status(400).json({ error: "Faltan campos obligatorios: nombre, precio, sku o categoriaId" });
    }

    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        precio,
        sku,
        categoriaId,
        variantes: {
          create: variantes // Espera: [{talla: 'M', color: 'Rojo', stock: 10}]
        }
      },
      include: {
        variantes: true // Para devolver el producto con sus variantes creadas
      }
    });

    res.status(201).json(producto);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al crear producto", detalle: error.message });
  }
};

export const getProductos = async (req: Request, res: Response) => {
  try {
    const { categoria, color, talla, minPrecio, maxPrecio, search, page = 1, limit = 10 } = req.query;

    // Convertimos page y limit a números para los cálculos de paginación
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Construimos el filtro dinámico para Prisma
    const where: any = {
      activo: true, // Siempre solo productos activos
    };

    // Filtro por búsqueda de texto (Nombre o Descripción)
    if (search) {
      where.OR = [
        { nombre: { contains: String(search), mode: 'insensitive' } },
        { descripcion: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    // Filtro por categoría (Slug o ID)
    if (categoria) {
      where.categoria = { slug: String(categoria) };
    }

    // Filtro por rango de precios
    if (minPrecio || maxPrecio) {
      where.precio = {
        gte: minPrecio ? Number(minPrecio) : undefined,
        lte: maxPrecio ? Number(maxPrecio) : undefined,
      };
    }

    // Filtro por variantes (Color o Talla)
    if (color || talla) {
      where.variantes = {
        some: {
          ...(color && { color: String(color) }),
          ...(talla && { talla: String(talla) }),
          stock: { gt: 0 } // Solo mostrar si hay stock en esa variante
        }
      };
    }

    // Consultamos productos y el total para la paginación
    const [productos, total] = await prisma.$transaction([
      prisma.producto.findMany({
        where,
        include: { categoria: true, variantes: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.producto.count({ where })
    ]);

    res.json({
      info: {
        totalRegistros: total,
        paginas: Math.ceil(total / take),
        paginaActual: Number(page)
      },
      resultados: productos
    });
  } catch (error) {
    res.status(500).json({ error: "Error al filtrar productos" });
  }
};

// Añadir al controlador de productos
export const getProductoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producto = await prisma.producto.findUnique({
      where: { id: Number(id) },
      include: { 
        categoria: true, 
        variantes: true, 
        imagenes: true // Incluimos la galería de fotos también
      }
    });

    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

export const getProductoBySku = async (req: Request, res: Response) => {
  try {
    const { sku } = req.params;
    const producto = await prisma.producto.findUnique({
      where: { sku: sku },
      include: { 
        categoria: true, 
        variantes: true, 
        imagenes: true 
      }
    });

    if (!producto) {
      return res.status(404).json({ message: `Producto con SKU ${sku} no encontrado` });
    }
    
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar por SKU" });
  }
};

export const subirGaleriaProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[]; // Recibe múltiples archivos

    if (!files || files.length === 0) return res.status(400).json({ error: "No hay imágenes" });

    const promesasSubida = files.map(async (file, index) => {
      const fileName = `galeria/${id}-${Date.now()}-${index}.${file.originalname.split('.').pop()}`;
      
      // Subir a Supabase
      const { data, error } = await supabase.storage
        .from('tienda-imagenes')
        .upload(fileName, file.buffer);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('tienda-imagenes').getPublicUrl(fileName);

      // Guardar en la tabla ImagenProducto
      return prisma.imagenProducto.create({
        data: {
          url: publicUrl,
          productoId: Number(id),
          orden: index
        }
      });
    });

    const imagenesGuardadas = await Promise.all(promesasSubida);
    res.json({ message: "Galería actualizada", imagenes: imagenesGuardadas });

  } catch (error) {
    res.status(500).json({ error: "Error en la galería" });
  }
};

export const getOpcionesFiltro = async (req: Request, res: Response) => {
  try {
    const [colores, tallas, precios] = await Promise.all([
      prisma.varianteProducto.findMany({
        where: { producto: { activo: true } },
        select: { color: true },
        distinct: ['color'],
        orderBy: { color: 'asc' }
      }),
      prisma.varianteProducto.findMany({
        where: { producto: { activo: true } },
        select: { talla: true },
        distinct: ['talla'],
        orderBy: { talla: 'asc' }
      }),
      prisma.producto.aggregate({
        where: { activo: true },
        _min: { precio: true },
        _max: { precio: true }
      })
    ]);

    res.json({
      colores: colores.map(c => c.color),
      tallas: tallas.map(t => t.talla),
      precioMin: Number(precios._min.precio) || 0,
      precioMax: Number(precios._max.precio) || 1000
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener opciones de filtro" });
  }
};

export const eliminarProducto = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // En lugar de delete, hacemos update
  await prisma.producto.update({
    where: { id: Number(id) },
    data: { activo: false }
  });

  res.json({ message: "Producto desactivado correctamente (Soft Delete)" });
};