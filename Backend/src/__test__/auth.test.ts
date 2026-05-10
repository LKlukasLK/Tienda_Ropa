import request from 'supertest';
import { app } from '../index';

describe('Pruebas de Autenticación', () => {

  it('Debe fallar el registro si el email es inválido (Zod Test)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: "Prueba",
        apellidos: "Test",
        email: "correo-falso", // Email mal formado
        password: "123"
      });

    expect(res.statusCode).toEqual(400); // Bad Request
    expect(res.body.status).toBe('error');
  });
});