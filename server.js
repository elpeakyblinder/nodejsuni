const express = require('express'); 
const bcrypt = require('bcrypt'); 
const mysql = require('mysql2/promise'); 
const path = require('path'); 
const app = express(); 
const PORT = 30001;

// Configuración del middleware
app.use(express.json()); 
app.use(express.static(__dirname));

// Conexión a MySQL
const pool = mysql.createPool({ 
    host: 'localhost',
    user: 'root',
    password: '', // Tu contraseña de MySQL
    database: 'mi_base'
});

// Ruta principal para login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './login.html'));
});

// Ruta para procesar el login
app.post('/login', async (req, res) => { // Aquí corregido: sin './login'
    const { username, password } = req.body;

    try { 
        // Buscar usuario
        const [users] = await pool.query(
            'SELECT * FROM usuarios WHERE username = ?', 
            [username]
        );
        
        // Verificar si existe
        if (users.length === 0) { 
            return res.status(401).json({ error: 'Usuario no existe' }); 
        }
        
        const user = users[0];
        
        // Validar contraseña
        const valid = await bcrypt.compare(password, user.password); 
        if (!valid) { 
            return res.status(401).json({ error: 'Contraseña incorrecta' }); 
        }
        
        // Login exitoso
        res.json({ 
            success: true, 
            username: user.username, 
            role: user.role || 'user' 
        });

    } catch (error) { 
        console.error('Error en login:', error); 
        res.status(500).json({ error: 'Error en el servidor' }); 
    }
});

// Inicio del servidor
app.listen(PORT, () => { 
    console.log(`Servidor listo en http://localhost:${PORT}`); 
});
