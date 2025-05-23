const request = require('supertest');
const express = require('express');
const loginRouter = require('../routes/login');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock de los módulos necesarios
jest.mock('../db', () => {
  const mockPool = {
    request: jest.fn().mockReturnThis(),
    input: jest.fn().mockReturnThis(),
    query: jest.fn()
  };
  
  return {
    getConnection: jest.fn().mockResolvedValue(mockPool),
    sql: {
      VarChar: jest.fn().mockReturnValue('VARCHAR')
    }
  };
});

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Configuración de la app Express para testing
const app = express();
app.use(express.json());
app.use('/api/login', loginRouter);

describe('Login API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe retornar 401 si el usuario no existe', async () => {
    const { getConnection } = require('../db');
    const mockPool = await getConnection();
    mockPool.query.mockResolvedValueOnce({ recordset: [] });

    const response = await request(app)
      .post('/api/login')
      .send({ nombre: 'usuarioInexistente', password: 'contraseña123' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Usuario o contraseña incorrectos');
    expect(mockPool.input).toHaveBeenCalledWith('nombre', 'VARCHAR', 'usuarioInexistente');
  });

  test('debe retornar 401 si la contraseña es incorrecta', async () => {
    const { getConnection } = require('../db');
    const mockPool = await getConnection();
    mockPool.query.mockResolvedValueOnce({
      recordset: [{ id_usuario: 1, nombre: 'usuario1', password: 'hashedPassword' }]
    });

    bcrypt.compare.mockResolvedValueOnce(false);

    const response = await request(app)
      .post('/api/login')
      .send({ nombre: 'usuario1', password: 'contraseñaIncorrecta' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Usuario o contraseña incorrectos');
    expect(bcrypt.compare).toHaveBeenCalledWith('contraseñaIncorrecta', 'hashedPassword');
  });

  test('debe retornar 200 y un token JWT si las credenciales son correctas', async () => {
    const { getConnection } = require('../db');
    const mockPool = await getConnection();
    const mockUser = {
      id_usuario: 1,
      nombre: 'usuario1',
      password: 'hashedPassword',
      email: 'usuario1@example.com'
    };
    
    mockPool.query.mockResolvedValueOnce({
      recordset: [mockUser]
    });

    bcrypt.compare.mockResolvedValueOnce(true);
    jwt.sign.mockReturnValueOnce('mock_jwt_token');

    const response = await request(app)
      .post('/api/login')
      .send({ nombre: 'usuario1', password: 'contraseñaCorrecta' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login exitoso');
    expect(response.body.token).toBe('mock_jwt_token');
    expect(response.body.user).toHaveProperty('id_usuario', 1);
    expect(response.body.user).toHaveProperty('nombre', 'usuario1');
    expect(response.body.user).not.toHaveProperty('password');
    
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 1, nombre: 'usuario1' },
      'clave_secreta_jwt_marcelocardenas',
      { expiresIn: '24h' }
    );
  });

  test('debe retornar 500 si ocurre un error en el servidor', async () => {
    const { getConnection } = require('../db');
    const mockPool = await getConnection();
    mockPool.query.mockRejectedValueOnce(new Error('Error de base de datos'));

    const response = await request(app)
      .post('/api/login')
      .send({ nombre: 'usuario1', password: 'contraseña123' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error en el servidor');
  });
});
