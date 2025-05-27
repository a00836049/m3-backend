const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const usersRoutes = require('./routes/getusers');
const postUsersRoutes = require('./routes/postusers');
const updateUserRoutes = require('./routes/updateuser');
const deleteUserRoutes = require('./routes/deleteuser');
const loginRoutes = require('./routes/login');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ruta pública
app.use('/login', loginRoutes);

// Rutas protegidas con JWT
app.use('/users', authMiddleware, usersRoutes);
app.use('/postusers', authMiddleware, postUsersRoutes);
app.use('/updateuser', authMiddleware, updateUserRoutes);
app.use('/deleteuser', authMiddleware, deleteUserRoutes);

app.listen(PORT, () => {   
  // eslint-disable-next-line no-console
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`📚 Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
