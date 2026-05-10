import request from 'supertest';
// Necesitamos exportar 'app' desde tu index.ts para que supertest la use
// Si no la tienes exportada, pon "export const app = express()..." en index.ts
import { app } from '../index'; 

describe('Pruebas de la API de Productos', () => {
  
  it('Debe devolver una lista de productos con status 200', async () => {
    const res = await request(app).get('/api/productos');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.resultados)).toBe(true);
  });

  it('Debe devolver 404 si el producto no existe', async () => {
    const res = await request(app).get('/api/productos/999999');
    expect(res.statusCode).toEqual(404);
  });
});