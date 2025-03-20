// Importaciones de dependencias necesarias
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Datos de configuración para conexión mysql
const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'registro_empleado',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hacer conexión ...
connection.getConnection((err, conn) => {
    if (err) {
        console.error('Error al conectar a la base de datos', err.stack);
        return;
    }
    console.log('Conectado a MySQL con ID ' + conn.threadId);
    conn.release();
});

//Ruta para el menu
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'menu.hmtl'));
});

// Ruta de registro de empleados
app.post('/register', (req, res) => {

    const { nombre, email, puesto, fechaNacimiento, curp, rfc, nss, genero, tipoContrato } = req.body;

    if (!nombre || !email || !puesto || !fechaNacimiento || !curp || !rfc || !nss || !genero || !tipoContrato) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const query = 'INSERT INTO empleados (nombre_empleado, email_empleado, puesto_empleado, fechaNacimiento, curp, rfc, nss, genero, tipoContrato) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.execute(query, [nombre, email, puesto, fechaNacimiento, curp, rfc, nss, genero, tipoContrato], (error, results) => {
        if (error) {
            console.error('Error al insertar en la base de datos:', error);
            return res.status(500).send('Error al registrar empleado');
        }

        res.status(201).send('Empleado registrado correctamente');
    });
});

app.get('/empleados', (req, res) => {
    const query = 'SELECT id_empleado, nombre_empleado, email_empleado, puesto_empleado, fechaNacimiento, genero, tipoContrato FROM empleados';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los empleados', error);
            return res.status(500).json({ error: 'Error al obtener empleados' });
        }
        res.json(results);
    });
});


// Ruta para eliminar un empleado por ID, se asigna un boton de delete a cada row de la tabla el cual recoge su ID de empleado correspondiente para asímismo saber qué empleado va a eliminarse
app.delete('/empleados/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM empleados WHERE id_empleado = ?';
    connection.execute(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el empleado:', error);
            return res.status(500).send('Error al eliminar empleado');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Empleado no encontrado');
        }

        res.send('Empleado eliminado correctamente');
    });
});


// Inicia el servidor
const PORT = 3000; //cambiar al puerto que corresponda
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
