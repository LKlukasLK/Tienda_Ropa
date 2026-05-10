import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_provisional';

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, apellidos, email, password } = req.body;

    // Verificar si el email ya existe
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ message: "El correo ya está registrado" });

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario (el rol por defecto es USER según tu schema)
    const user = await prisma.user.create({
      data: {
        nombre,
        apellidos,
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({ message: "Usuario creado", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Credenciales incorrectas" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Credenciales incorrectas" });

    // Generar Token (incluimos el rol para el Frontend)
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, nombre: user.nombre, rol: user.rol }
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
};