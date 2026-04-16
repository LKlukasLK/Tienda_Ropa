import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

// En Prisma 6, el cliente lee automáticamente el .env, no hay que pasarle nada
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/productos', async (req, res) => {
    try {
        const productos = await prisma.producto.findMany();
        res.json(productos);
    } catch (e) {
        res.status(500).json({ error: "Error de conexión con la base de datos" });
    }
});

// 1. CREAR CATEGORÍA (Necesaria antes de crear productos)
app.post('/categorias', async (req, res) => {
    try {
        const { nombre } = req.body;
        const nueva = await prisma.categoria.create({
            data: { nombre }
        });
        res.status(201).json(nueva);
    } catch (error) {
        res.status(400).json({ error: "Esa categoría ya existe" });
    }
});

// 2. CREAR PRODUCTO
app.post('/productos', async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoriaId } = req.body;
        
        const nuevo = await prisma.producto.create({
            data: { nombre, descripcion, precio, stock, categoriaId }
        });
        
        res.status(201).json(nueva);
    } catch (error: any) {
        // El código P2002 es el error de Prisma para "Valor Único Duplicado"
        if (error.code === 'P2002') {
            return res.status(400).json({ 
                error: "Ya existe un producto con este nombre. Intenta con otro." 
            });
        }
        
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.listen(3000, () => {
    console.log(`🚀 Servidor estable corriendo en http://localhost:3000`);
});