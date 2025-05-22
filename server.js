const express = require('express');
const cors = require('cors');
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

// Ruta pública
app.use('/login', loginRoutes);

// Rutas protegidas con JWT
app.use('/users', authMiddleware, usersRoutes);
app.use('/postusers', authMiddleware, postUsersRoutes);
app.use('/updateuser', authMiddleware, updateUserRoutes);
app.use('/deleteuser', authMiddleware, deleteUserRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
