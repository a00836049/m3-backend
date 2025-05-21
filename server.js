const express = require('express');
const cors = require('cors');
const usersRoutes = require('./routes/getusers');
const postUsersRoutes = require('./routes/postusers');
const updateUserRoutes = require('./routes/updateuser');
const deleteUserRoutes = require('./routes/deleteuser');



const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/users', usersRoutes);
app.use('/postusers', postUsersRoutes);
app.use('/updateuser', updateUserRoutes);
app.use('/deleteuser', deleteUserRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
