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

    formCliente.addEventListener("submit", function(event) {

        event.preventDefault();


        // =================================
        // OBTENER DATOS
        // =================================

        const nombre = document.getElementById("nombre").value;

        const dni = document.getElementById("dni").value;

        const telefono = document.getElementById("telefono").value;

        const direccion = document.getElementById("direccion").value;

        const estado = document.getElementById("estado").value;


        // =================================
        // CREAR NUEVA FILA
        // =================================

        const nuevaFila = document.createElement("tr");


        // =================================
        // CREAR ESTADO
        // =================================

        let estadoHTML;


        if (estado === "ACTIVO") {

            estadoHTML = `
                <span class="estado activo">
                    Activo
                </span>
            `;

        } else {

            estadoHTML = `
                <span class="estado bloqueado">
                    Bloqueado
                </span>
            `;

        }


        // =================================
        // CONTENIDO DE LA FILA
        // =================================

        nuevaFila.innerHTML = `

            <td>${nombre}</td>

            <td>${dni}</td>

            <td>${telefono}</td>

            <td>${direccion}</td>

            <td>
                ${estadoHTML}
            </td>

            <td>

            <button class="btn-tabla btn-ver">
                Ver
            </button>

            <button class="btn-tabla btn-editar">
                Editar
            </button>

            </td>

        `;


        // =================================
        // AGREGAR FILA A LA TABLA
        // =================================

        tablaClientes.appendChild(nuevaFila);


        // =================================
        // CERRAR FORMULARIO
        // =================================

        formularioCliente.style.display = "none";


        // =================================
        // LIMPIAR FORMULARIO
        // =================================

        formCliente.reset();


        // =================================
        // MENSAJE
        // =================================

        console.log("Cliente agregado:", nombre);

    });

}
