import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_provisional';

// Extendemos la interfaz de Request para poder guardar el usuario dentro de 'req'
export interface AuthRequest extends Request {
    user?: { id: number; rol: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Espera "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: "No hay token, autorización denegada" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; rol: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token no es válido" });
    }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && (req.user.rol === 'ADMIN' || req.user.rol === 'EDITOR')) {
        next();
    } else {
        res.status(403).json({ message: "Acceso denegado: se requieren permisos de administrador" });
    }
};