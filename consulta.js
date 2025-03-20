// PAra cargar los empleados
async function cargarEmpleados() {
    try {
        const API_URL = 'http://localhost:3000';
        const respuesta = await fetch(`${API_URL}/empleados`);
        const empleados = await respuesta.json();

        const tabla = document.getElementById('tablaEmpleados');
        empleados.forEach(emp => {
            const fila = `
                <tr class= "text-center">
                    <td>${emp.id_empleado}</td>
                    <td>${emp.nombre_empleado}</td>
                    <td>${emp.email_empleado}</td>
                    <td>${emp.puesto_empleado}</td>
                    <td>${emp.fechaNacimiento}</td>
                    <td>${emp.genero}</td>
                    <td>${emp.tipoContrato}</td>
                    <td>
                        <button class="btn text-center btn-danger btn-sm" onclick="eliminarEmpleado(${emp.id_empleado})">Borrar</button>
                        <button class="btn text-center btn-primary btn-sm" onclick="actualizarEmpleado(${emp.id_empleado})">Actualizar</button>
                    </td>
                </tr>
            `; //con (${emp.id_empleado}) se le asigna el id a cada boton o recoge el id del row que le pertenece, se me hace fácil este proceso porque en el punto de venta que estoy programando tiene cruds por todos lados que manejan este tipo de procesos y algo más com
            tabla.insertAdjacentHTML('beforeend', fila);
        });
    } catch (error) {
        console.error('Error al cargar empleados:', error);
    }
}
cargarEmpleados();

// Para eliminar empleado, la idea
// Lo ideal sería poner un modal de confirmacion para que no sea programacion para valientes y evitar que por un missclick se borre un empleado
async function eliminarEmpleado(id) {
    try {
        const API_URL = 'http://localhost:3000';
        const respuesta = await fetch(`${API_URL}/empleados/${id}`, {
            method: 'DELETE'
        });

        if (respuesta.ok) {
            alert('Empleado eliminado correctamente pa eres un genio');
            location.reload(); // refrescar la tabla para poder ver los cambios efectuados
        } else {
            alert('Error al eliminar el empleado revisa tu codigo pa');
        }
    } catch (error) {
        console.error('Error al eliminar empleado chequea el error:', error);
    }
}

