console.log("Sistema de préstamos iniciado");


// =================================
// DASHBOARD
// =================================

const botonVerTodos = document.getElementById("verTodos");

if (botonVerTodos) {

    botonVerTodos.addEventListener("click", function() {

        alert("Aquí mostraremos todos los vencimientos.");

    });

}


// =================================
// CLIENTES
// =================================

const botonNuevoCliente = document.getElementById("btnNuevoCliente");

const botonCancelarCliente = document.getElementById("btnCancelarCliente");

const formularioCliente = document.getElementById("formularioCliente");

const formCliente = document.getElementById("formCliente");

const tablaClientes = document.getElementById("tablaClientes");


// =================================
// MOSTRAR FORMULARIO
// =================================

if (botonNuevoCliente) {

    botonNuevoCliente.addEventListener("click", function() {

        formularioCliente.style.display = "block";

    });

}


// =================================
// CANCELAR
// =================================

if (botonCancelarCliente) {

    botonCancelarCliente.addEventListener("click", function() {

        formularioCliente.style.display = "none";

        formCliente.reset();

    });

}


// =================================
// GUARDAR CLIENTE
// =================================

if (formCliente) {
    formCliente.addEventListener("submit", async function(event) {
        event.preventDefault();

        // =================================
        // OBTENER DATOS
        // =================================

        const nombre = document.getElementById("nombre").value;

        const dni = document.getElementById("dni").value;

        const telefono = document.getElementById("telefono").value;

        const direccion = document.getElementById("direccion").value;

        // =================================
        // OBTENER TOKER Y PRESTAMISTAID GUARDADOS POST LOGIN
        // =================================

        const token = localStorage.getItem("jwtToken");
        const prestamistaId = localStorage.getItem("prestamistaId") || 1;

        // =================================
        // ENVIAR DATOS AL BACK VIA API REST
        // =================================
        try {
            const respuesta = await fetch(`http://localhost:8080/api/v1/clientes?prestamistaId=${prestamistaId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: nombre,
                    dni: dni,
                    telefono: telefono,
                    direccion: direccion
                })
            });

            if (respuesta.ok) {
                const clienteGuardado = await respuesta.json();
                
                const nuevaFila = document.createElement("tr");

                let estadoHTML = `<span class="estado activo">Activo</span>`;

                nuevaFila.innerHTML = `
                    <td>${clienteGuardado.nombre}</td>
                    <td>${clienteGuardado.dni}</td>
                    <td>${clienteGuardado.telefono}</td>
                    <td>${clienteGuardado.direccion}</td>
                    <td>${estadoHTML}</td>
                    <td>
                        <button class="btn-tabla btn-ver">Ver</button>
                        <button class="btn-tabla btn-editar">Editar</button>
                    </td>
                `;

                tablaClientes.appendChild(nuevaFila);

        // =================================
        // CERRAR Y LIMPIAR FORMULARIO
        // =================================

                formularioCliente.style.display = "none";
                formCliente.reset();
                console.log("Cliente guardado exitosamente en PostgreSQL:", clienteGuardado);

            } else if (respuesta.status === 403 || respuesta.status === 401) {
                alert("Sesión expirada o no autorizada. Por favor iniciá sesión nuevamente.");
            } else {
                alert("Error al guardar el cliente en la base de datos.");
            }
        } catch (error) {
            console.error("Error de conexión con el servidor backend:", error);
            alert("No se pudo conectar con el servidor Spring Boot.");
        }
    });
}

// ==========================================
// CARGAR CLIENTES DESDE EL BACKEND AL INICIAR
// ==========================================
async function cargarClientes() {
    const token = localStorage.getItem("jwtToken");
    const prestamistaId = localStorage.getItem("prestamistaId") || 1;

    if (!tablaClientes) return;

    try {
        const respuesta = await fetch(`http://localhost:8080/api/v1/clientes?prestamistaId=${prestamistaId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (respuesta.ok) {
            const clientes = await respuesta.json();
            tablaClientes.innerHTML = ""; 

            clientes.forEach(cliente => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${cliente.nombre}</td>
                    <td>${cliente.dni}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.direccion}</td>
                    <td><span class="estado activo">${cliente.estado}</span></td>
                    <td>
                        <button class="btn-tabla btn-ver">Ver</button>
                        <button class="btn-tabla btn-editar">Editar</button>
                    </td>
                `;
                tablaClientes.appendChild(fila);
            });
        }
    } catch (error) {
        console.error("Error al cargar clientes desde PostgreSQL:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarClientes);