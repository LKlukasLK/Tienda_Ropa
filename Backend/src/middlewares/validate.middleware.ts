import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      // Verificamos si es un error de validación de Zod
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          mensaje: "Error de validación",
          // Usamos error.issues que es más seguro en Zod
          detalles: error.issues.map((issue) => ({
            campo: issue.path[1] || issue.path[0],
            mensaje: issue.message
          }))
        });
      }
      
      // Si es otro tipo de error, lo mandamos al error handler global
      next(error);
    }
  };