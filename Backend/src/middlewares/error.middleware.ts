import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[ERROR GLOBAL]:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Solo mostrar el stack de error si estamos en desarrollo
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};