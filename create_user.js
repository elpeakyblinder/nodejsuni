const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createUser() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mi_base'
    });

    const password = 'elpeakyblidner666'; // Cambia esto por la contraseña que tu quieres
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
        'INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)',
        ['paulina', hashedPassword, 'admin']
    );

    console.log('Usuario creado con contraseña hasheada');
    process.exit();
}

createUser();