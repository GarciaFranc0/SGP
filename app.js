
console.log("Sistema de préstamos iniciado");



// ========================================
// LOGIN
// ========================================

const formularioLogin =
    document.getElementById("formularioLogin");

if (formularioLogin) {

    formularioLogin.addEventListener(
        "submit",
        async function(evento) {

            evento.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const mensajeLogin =
                document.getElementById("mensajeLogin");


            try {

                const respuesta =
                    await fetch(
                        "http://localhost:8080/api/v1/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                if (!respuesta.ok) {

                    mensajeLogin.textContent =
                        "Email o contraseña incorrectos.";

                    return;
                }


                const datos =
                    await respuesta.json();


                console.log(
                    "Login correcto"
                );


                localStorage.setItem(
                    "jwtToken",
                    datos.token
                );


                localStorage.setItem(
                    "prestamistaId",
                    datos.prestamistaId
                );


                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(
                    "Error de login:",
                    error
                );


                mensajeLogin.textContent =
                    "No se pudo conectar con el servidor.";
            }
        }
    );
}



// ========================================
// ELEMENTOS DE CLIENTES
// ========================================

const formularioCliente =
    document.getElementById("formCliente");

const contenedorFormularioCliente =
    document.getElementById("formularioCliente");

const tablaClientes =
    document.getElementById("tablaClientes");

const buscador =
    document.getElementById("buscarCliente");

const btnNuevoCliente =
    document.getElementById("btnNuevoCliente");

const btnCancelarCliente =
    document.getElementById("btnCancelarCliente");


// ========================================
// CLIENTES CARGADOS
// ========================================

// Guardamos los clientes que vienen del backend
// para poder utilizarlos en "Ver" y "Editar".

let clientesCargados = [];


// Guarda el ID del cliente que estamos editando.
// Si es null, estamos creando un cliente nuevo.

let clienteEditandoId = null;



// ========================================
// MOSTRAR FORMULARIO NUEVO CLIENTE
// ========================================

if (btnNuevoCliente) {

    btnNuevoCliente.addEventListener(
        "click",
        function() {

            // Indicar que no estamos editando
            clienteEditandoId = null;


            // Limpiar formulario
            if (formularioCliente) {
                formularioCliente.reset();
            }


            // Mostrar formulario
            if (contenedorFormularioCliente) {

                contenedorFormularioCliente.style.display =
                    "block";
            }


            // Cambiar texto del botón si existe
            const btnGuardar =
                document.getElementById(
                    "btnGuardarCliente"
                );

            if (btnGuardar) {

                btnGuardar.textContent =
                    "Guardar cliente";
            }


            // Llevar el cursor al nombre
            const nombre =
                document.getElementById("nombre");

            if (nombre) {
                nombre.focus();
            }
        }
    );
}



// ========================================
// CANCELAR FORMULARIO CLIENTE
// ========================================

if (btnCancelarCliente) {

    btnCancelarCliente.addEventListener(
        "click",
        function() {

            clienteEditandoId = null;


            if (formularioCliente) {
                formularioCliente.reset();
            }


            if (contenedorFormularioCliente) {

                contenedorFormularioCliente.style.display =
                    "none";
            }


            const btnGuardar =
                document.getElementById(
                    "btnGuardarCliente"
                );

            if (btnGuardar) {

                btnGuardar.textContent =
                    "Guardar cliente";
            }
        }
    );
}



// ========================================
// CARGAR CLIENTES
// ========================================

async function cargarClientes() {

    const token =
        localStorage.getItem("jwtToken");

    const prestamistaId =
        localStorage.getItem("prestamistaId");


    if (!token || !prestamistaId) {

        console.error(
            "No hay sesión iniciada."
        );

        return;
    }


    try {

        const url =
            "http://localhost:8080/api/v1/clientes?prestamistaId=" +
            prestamistaId;


        const respuesta =
            await fetch(
                url,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener los clientes"
            );
        }


        const clientes =
            await respuesta.json();


        console.log(
            "Clientes obtenidos:",
            clientes
        );


        // ========================================
        // GUARDAR CLIENTES
        // ========================================

        clientesCargados =
            clientes;


        // ========================================
        // MOSTRAR CLIENTES
        // ========================================

        mostrarClientes(
            clientes
        );


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        if (tablaClientes) {

            tablaClientes.innerHTML =
                "<tr>" +
                "<td colspan='6'>" +
                "Error al cargar los clientes" +
                "</td>" +
                "</tr>";
        }
    }
}



// ========================================
// MOSTRAR CLIENTES
// ========================================

function mostrarClientes(clientes) {

    if (!tablaClientes) {
        return;
    }


    tablaClientes.innerHTML = "";


    if (clientes.length === 0) {

        tablaClientes.innerHTML =
            "<tr>" +
            "<td colspan='6'>" +
            "No hay clientes registrados" +
            "</td>" +
            "</tr>";

        return;
    }


    clientes.forEach(
        function(cliente) {

            const fila =
                document.createElement("tr");


            fila.innerHTML =
                "<td>" +
                (cliente.nombre || "-") +
                "</td>" +

                "<td>" +
                (cliente.dni || "-") +
                "</td>" +

                "<td>" +
                (cliente.telefono || "-") +
                "</td>" +

                "<td>" +
                (cliente.direccion || "-") +
                "</td>" +

                "<td>" +

                "<span class='estado " +

                (
                    cliente.estado === "ACTIVO"
                        ? "activo"
                        : "bloqueado"
                ) +

                "'>" +

                (
                    cliente.estado === "ACTIVO"
                        ? "Activo"
                        : "Bloqueado"
                ) +

                "</span>" +

                "</td>" +

                "<td>" +

                "<button " +
                "class='btn-tabla' " +
                "onclick='verCliente(" +
                cliente.id +
                ")'>" +
                "Ver" +
                "</button>" +

                "<button " +
                "class='btn-tabla' " +
                "onclick='editarCliente(" +
                cliente.id +
                ")'>" +
                "Editar" +
                "</button>" +

                "</td>";


            tablaClientes.appendChild(
                fila
            );
        }
    );
}



// ========================================
// CREAR / EDITAR CLIENTE
// ========================================

if (formularioCliente) {

    formularioCliente.addEventListener(
        "submit",
        async function(evento) {

            evento.preventDefault();


            const token =
                localStorage.getItem(
                    "jwtToken"
                );


            const prestamistaId =
                localStorage.getItem(
                    "prestamistaId"
                );


            const nombre =
                document.getElementById(
                    "nombre"
                ).value.trim();


            const dni =
                document.getElementById(
                    "dni"
                ).value.trim();


            const telefono =
                document.getElementById(
                    "telefono"
                ).value.trim();


            const direccion =
                document.getElementById(
                    "direccion"
                ).value.trim();



            // ========================================
            // VALIDAR NOMBRE
            // ========================================

            if (nombre === "") {

                alert(
                    "El nombre es obligatorio."
                );

                return;
            }



            // ========================================
            // VALIDAR DNI
            // ========================================

            if (dni === "") {

                alert(
                    "El DNI es obligatorio."
                );

                return;
            }



            // ========================================
            // VALIDAR TELÉFONO
            // ========================================

            if (telefono === "") {

                alert(
                    "El teléfono es obligatorio."
                );

                return;
            }


            const telefonoValido =
                /^[0-9+\-\s()]+$/;


            if (!telefonoValido.test(telefono)) {

                alert(
                    "El teléfono contiene caracteres no válidos."
                );

                return;
            }



            // ========================================
            // SI ESTAMOS EDITANDO
            // ========================================

            if (clienteEditandoId !== null) {

                alert(
                    "El formulario de edición está preparado. " +
                    "Para guardar los cambios necesitamos agregar " +
                    "el endpoint PUT de clientes en el backend."
                );

                return;
            }



            // ========================================
            // CREAR CLIENTE
            // ========================================

            try {

                const url =
                    "http://localhost:8080/api/v1/clientes?prestamistaId=" +
                    prestamistaId;


                console.log(
                    "Enviando cliente..."
                );


                const respuesta =
                    await fetch(
                        url,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token
                            },

                            body: JSON.stringify({

                                nombre:
                                    nombre,

                                dni:
                                    dni,

                                telefono:
                                    telefono,

                                direccion:
                                    direccion
                            })
                        }
                    );


                if (!respuesta.ok) {

                    const textoError =
                        await respuesta.text();


                    console.error(
                        "Respuesta del servidor:",
                        textoError
                    );


                    throw new Error(
                        "No se pudo crear el cliente"
                    );
                }


                const clienteCreado =
                    await respuesta.json();


                console.log(
                    "Cliente creado:",
                    clienteCreado
                );


                alert(
                    "Cliente creado correctamente."
                );


                clienteEditandoId = null;


                formularioCliente.reset();


                contenedorFormularioCliente.style.display =
                    "none";


                await cargarClientes();


            } catch (error) {

                console.error(
                    "Error:",
                    error
                );


                alert(
                    "Ocurrió un error al crear el cliente."
                );
            }
        }
    );
}



// ========================================
// BUSCADOR DE CLIENTES
// ========================================

if (buscador) {

    buscador.addEventListener(
        "input",
        function() {

            const texto =
                buscador.value.toLowerCase();


            const filas =
                tablaClientes.querySelectorAll(
                    "tr"
                );


            filas.forEach(
                function(fila) {

                    const contenido =
                        fila.textContent.toLowerCase();


                    if (
                        contenido.includes(texto)
                    ) {

                        fila.style.display =
                            "";

                    } else {

                        fila.style.display =
                            "none";
                    }
                }
            );
        }
    );
}



// ========================================
// VER CLIENTE
// ========================================

async function verCliente(id) {

    const token =
        localStorage.getItem("jwtToken");

    const prestamistaId =
        localStorage.getItem("prestamistaId");

    if (!token || !prestamistaId) {
        alert("No hay una sesión iniciada.");
        return;
    }

    try {

        const url =
            "http://localhost:8080/api/v1/clientes/" +
            id +
            "?prestamistaId=" +
            prestamistaId;

        const respuesta =
            await fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            "Bearer " + token,
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo obtener el cliente."
            );
        }

        const cliente =
            await respuesta.json();

        // ========================================
        // MOSTRAR INFORMACIÓN
        // ========================================

        const nombre =
            cliente.nombre || "-";

        const dni =
            cliente.dni || "-";

        const telefono =
            cliente.telefono || "-";

        const direccion =
            cliente.direccion || "-";

        const estado =
            cliente.estado || "ACTIVO";

        alert(
            "DETALLE DEL CLIENTE\n\n" +
            "Nombre: " + nombre + "\n" +
            "DNI: " + dni + "\n" +
            "Teléfono: " + telefono + "\n" +
            "Dirección: " + direccion + "\n" +
            "Estado: " + estado
        );

    } catch (error) {

        console.error(
            "Error al consultar cliente:",
            error
        );

        alert(
            "No se pudo obtener la información del cliente."
        );
    }
}


// ========================================
// EDITAR CLIENTE
// ========================================

async function editarCliente(id) {

    const token =
        localStorage.getItem("jwtToken");

    const prestamistaId =
        localStorage.getItem("prestamistaId");

    if (!token || !prestamistaId) {
        alert("No hay una sesión iniciada.");
        return;
    }

    try {

        // ========================================
        // OBTENER CLIENTE ACTUAL
        // ========================================

        const url =
            "http://localhost:8080/api/v1/clientes/" +
            id +
            "?prestamistaId=" +
            prestamistaId;

        const respuesta =
            await fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            "Bearer " + token,
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo obtener el cliente."
            );
        }

        const cliente =
            await respuesta.json();

        // ========================================
        // CARGAR DATOS EN EL FORMULARIO
        // ========================================

        document.getElementById("nombre").value =
            cliente.nombre || "";

        document.getElementById("dni").value =
            cliente.dni || "";

        document.getElementById("telefono").value =
            cliente.telefono || "";

        document.getElementById("direccion").value =
            cliente.direccion || "";

        // ========================================
        // MOSTRAR FORMULARIO
        // ========================================

        contenedorFormularioCliente.style.display =
            "block";

        document.getElementById("nombre").focus();

        alert(
            "Los datos del cliente fueron cargados.\n\n" +
            "La modificación se podrá guardar cuando " +
            "conectemos el PUT del backend."
        );

    } catch (error) {

        console.error(
            "Error al editar cliente:",
            error
        );

        alert(
            "No se pudo cargar el cliente para editar."
        );
    }
}




// ========================================
// CERRAR MODAL DEL CLIENTE
// ========================================

const modalCliente =
    document.getElementById(
        "modalCliente"
    );


const btnCerrarModalCliente =
    document.getElementById(
        "btnCerrarModalCliente"
    );


const btnCerrarModalClienteFooter =
    document.getElementById(
        "btnCerrarModalClienteFooter"
    );



// Botón X

if (btnCerrarModalCliente) {

    btnCerrarModalCliente.addEventListener(
        "click",
        function() {

            modalCliente.style.display =
                "none";
        }
    );
}



// Botón Cerrar

if (btnCerrarModalClienteFooter) {

    btnCerrarModalClienteFooter.addEventListener(
        "click",
        function() {

            modalCliente.style.display =
                "none";
        }
    );
}



// Cerrar haciendo clic fuera

if (modalCliente) {

    modalCliente.addEventListener(
        "click",
        function(evento) {

            if (
                evento.target === modalCliente
            ) {

                modalCliente.style.display =
                    "none";
            }
        }
    );
}



// ========================================
// INICIAR CLIENTES
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (tablaClientes) {

            cargarClientes();
        }
    }
);



// ========================================
// DASHBOARD
// ========================================

const cantidadClientes =
    document.getElementById(
        "cantidadClientes"
    );


const prestamosActivos =
    document.getElementById(
        "prestamosActivos"
    );


const dineroPrestado =
    document.getElementById(
        "dineroPrestado"
    );


const prestamosMora =
    document.getElementById(
        "prestamosMora"
    );



// ========================================
// CARGAR DATOS DEL DASHBOARD
// ========================================

async function cargarDashboard() {

    const token =
        localStorage.getItem(
            "jwtToken"
        );


    const prestamistaId =
        localStorage.getItem(
            "prestamistaId"
        );


    if (!token || !prestamistaId) {

        console.error(
            "No hay sesión iniciada."
        );

        return;
    }


    try {

        // ========================================
        // CLIENTES
        // ========================================

        const respuestaClientes =
            await fetch(
                "http://localhost:8080/api/v1/clientes?prestamistaId=" +
                prestamistaId,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!respuestaClientes.ok) {

            throw new Error(
                "Error al obtener los clientes"
            );
        }


        const clientes =
            await respuestaClientes.json();


        console.log(
            "Clientes del dashboard:",
            clientes
        );


        if (cantidadClientes) {

            cantidadClientes.textContent =
                clientes.length;
        }



        // ========================================
        // PRÉSTAMOS
        // ========================================

        const respuestaPrestamos =
            await fetch(
                "http://localhost:8080/api/v1/prestamos?prestamistaId=" +
                prestamistaId,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!respuestaPrestamos.ok) {

            throw new Error(
                "Error al obtener los préstamos"
            );
        }


        const prestamos =
            await respuestaPrestamos.json();



        // ========================================
        // PRÓXIMOS VENCIMIENTOS
        // ========================================

        const tablaVencimientos =
            document.getElementById(
                "tablaVencimientos"
            );


        if (tablaVencimientos) {

            tablaVencimientos.innerHTML =
                "";


            const prestamosProximos =
                prestamos.filter(
                    function(prestamo) {

                        return (
                            prestamo.estado ===
                            "ACTIVO"
                        );
                    }
                );


            if (
                prestamosProximos.length ===
                0
            ) {

                tablaVencimientos.innerHTML =
                    "<tr>" +
                    "<td colspan='4'>" +
                    "No hay próximos vencimientos" +
                    "</td>" +
                    "</tr>";


            } else {

                prestamosProximos.forEach(
                    function(prestamo) {

                        const fila =
                            document.createElement(
                                "tr"
                            );


                        let nombreCliente =
                            "Cliente";


                        if (
                            prestamo.cliente &&
                            prestamo.cliente.nombre
                        ) {

                            nombreCliente =
                                prestamo.cliente.nombre;
                        }


                        const monto =
                            Number(
                                prestamo.montoCapital ||
                                0
                            );


                        let vencimiento =
                            "-";


                        if (
                            prestamo.fechaVencimiento
                        ) {

                            const fecha =
                                new Date(
                                    prestamo.fechaVencimiento
                                );


                            vencimiento =
                                fecha.toLocaleDateString(
                                    "es-AR"
                                );
                        }


                        fila.innerHTML =
                            "<td>" +
                            nombreCliente +
                            "</td>" +

                            "<td>$ " +
                            monto.toLocaleString(
                                "es-AR"
                            ) +
                            "</td>" +

                            "<td>" +
                            vencimiento +
                            "</td>" +

                            "<td>" +

                            "<span class='estado activo'>" +

                            "Activo" +

                            "</span>" +

                            "</td>";


                        tablaVencimientos.appendChild(
                            fila
                        );
                    }
                );
            }
        }



        console.log(
            "Préstamos del dashboard:",
            prestamos
        );



        // ========================================
        // PRÉSTAMOS ACTIVOS
        // ========================================

        const prestamosActivosLista =
            prestamos.filter(
                function(prestamo) {

                    return (
                        prestamo.estado ===
                        "ACTIVO"
                    );
                }
            );


        if (prestamosActivos) {

            prestamosActivos.textContent =
                prestamosActivosLista.length;
        }



        // ========================================
        // DINERO PRESTADO
        // ========================================

        let totalDineroPrestado =
            0;


        prestamosActivosLista.forEach(
            function(prestamo) {

                totalDineroPrestado +=
                    Number(
                        prestamo.montoCapital ||
                        0
                    );
            }
        );


        if (dineroPrestado) {

            dineroPrestado.textContent =
                "$ " +
                totalDineroPrestado.toLocaleString(
                    "es-AR"
                );
        }



        // ========================================
        // PRÉSTAMOS EN MORA
        // ========================================

        const prestamosEnMora =
            prestamos.filter(
                function(prestamo) {

                    return (
                        prestamo.estado ===
                        "EN_MORA"
                    );
                }
            );


        if (prestamosMora) {

            prestamosMora.textContent =
                prestamosEnMora.length;
        }


    } catch (error) {

        console.error(
            "Error al cargar el dashboard:",
            error
        );
    }
}



// ========================================
// INICIAR DASHBOARD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (cantidadClientes) {

            cargarDashboard();
        }
    }
);



// ========================================
// PRÉSTAMOS
// ========================================

let prestamosCargados = [];


const formularioPrestamo =
    document.getElementById(
        "formPrestamo"
    );


const contenedorFormularioPrestamo =
    document.getElementById(
        "formularioPrestamo"
    );


const btnNuevoPrestamo =
    document.getElementById(
        "btnNuevoPrestamo"
    );


const btnCancelarPrestamo =
    document.getElementById(
        "btnCancelarPrestamo"
    );


const clientePrestamo =
    document.getElementById(
        "clientePrestamo"
    );



// ========================================
// MOSTRAR FORMULARIO PRÉSTAMO
// ========================================

if (btnNuevoPrestamo) {

    btnNuevoPrestamo.addEventListener(
        "click",
        function() {

            contenedorFormularioPrestamo.style.display =
                "block";

            cargarClientesParaPrestamo();
        }
    );
}



// ========================================
// CANCELAR FORMULARIO PRÉSTAMO
// ========================================

if (btnCancelarPrestamo) {

    btnCancelarPrestamo.addEventListener(
        "click",
        function() {

            formularioPrestamo.reset();

            contenedorFormularioPrestamo.style.display =
                "none";
        }
    );
}



// ========================================
// CARGAR CLIENTES EN SELECT
// ========================================

async function cargarClientesParaPrestamo() {

    const token =
        localStorage.getItem(
            "jwtToken"
        );


    const prestamistaId =
        localStorage.getItem(
            "prestamistaId"
        );


    if (!token || !prestamistaId) {

        console.error(
            "No hay sesión iniciada."
        );

        return;
    }


    try {

        const respuesta =
            await fetch(
                "http://localhost:8080/api/v1/clientes?prestamistaId=" +
                prestamistaId,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener los clientes"
            );
        }


        const clientes =
            await respuesta.json();


        clientePrestamo.innerHTML =
            "<option value=''>" +
            "Seleccioná un cliente" +
            "</option>";


        clientes.forEach(
            function(cliente) {

                const opcion =
                    document.createElement(
                        "option"
                    );


                opcion.value =
                    cliente.id;


                opcion.textContent =
                    cliente.nombre +
                    " - DNI " +
                    cliente.dni;


                clientePrestamo.appendChild(
                    opcion
                );
            }
        );


        console.log(
            "Clientes disponibles para préstamo:",
            clientes
        );


    } catch (error) {

        console.error(
            "Error al cargar clientes:",
            error
        );


        alert(
            "No se pudieron cargar los clientes."
        );
    }
}



// ========================================
// CREAR PRÉSTAMO
// ========================================

if (formularioPrestamo) {

    formularioPrestamo.addEventListener(
        "submit",
        async function(evento) {

            evento.preventDefault();


            const token =
                localStorage.getItem(
                    "jwtToken"
                );


            const prestamistaId =
                localStorage.getItem(
                    "prestamistaId"
                );


            const clienteId =
                document.getElementById(
                    "clientePrestamo"
                ).value;


            const montoCapital =
                document.getElementById(
                    "montoCapital"
                ).value;


            const porcentajeRecargo =
                document.getElementById(
                    "porcentajeRecargo"
                ).value;


            const frecuencia =
                document.getElementById(
                    "frecuenciaPrestamo"
                ).value;



            // ========================================
            // VALIDACIONES
            // ========================================

            if (clienteId === "") {

                alert(
                    "Seleccioná un cliente."
                );

                return;
            }


            if (
                montoCapital === "" ||
                Number(montoCapital) <= 0
            ) {

                alert(
                    "Ingresá un monto de capital válido."
                );

                return;
            }


            if (
                porcentajeRecargo === "" ||
                Number(porcentajeRecargo) < 0
            ) {

                alert(
                    "Ingresá un porcentaje de recargo válido."
                );

                return;
            }


            if (frecuencia === "") {

                alert(
                    "Seleccioná una frecuencia de pago."
                );

                return;
            }



            // ========================================
            // ENVIAR AL BACKEND
            // ========================================

            try {

                const url =
                    "http://localhost:8080/api/v1/prestamos" +
                    "?prestamistaId=" +
                    prestamistaId +
                    "&clienteId=" +
                    clienteId +
                    "&montoCapital=" +
                    montoCapital +
                    "&porcentajeRecargo=" +
                    porcentajeRecargo +
                    "&frecuencia=" +
                    frecuencia;


                console.log(
                    "Creando préstamo..."
                );


                const respuesta =
                    await fetch(
                        url,
                        {
                            method: "POST",

                            headers: {
                                "Authorization":
                                    "Bearer " + token
                            }
                        }
                    );


                if (!respuesta.ok) {

                    const textoError =
                        await respuesta.text();


                    console.error(
                        "Respuesta del servidor:",
                        textoError
                    );


                    throw new Error(
                        "No se pudo crear el préstamo"
                    );
                }


                const prestamoCreado =
                    await respuesta.json();


                console.log(
                    "Préstamo creado:",
                    prestamoCreado
                );


                alert(
                    "Préstamo creado correctamente."
                );


                formularioPrestamo.reset();


                contenedorFormularioPrestamo.style.display =
                    "none";


                cargarPrestamos();


                if (
                    typeof cargarDashboard ===
                    "function"
                ) {

                    cargarDashboard();
                }


            } catch (error) {

                console.error(
                    "Error al crear préstamo:",
                    error
                );


                alert(
                    "Ocurrió un error al crear el préstamo."
                );
            }
        }
    );
}



// ========================================
// CARGAR PRÉSTAMOS
// ========================================

async function cargarPrestamos() {

    const token =
        localStorage.getItem(
            "jwtToken"
        );


    const prestamistaId =
        localStorage.getItem(
            "prestamistaId"
        );


    const tablaPrestamos =
        document.getElementById(
            "tablaPrestamos"
        );


    if (!token || !prestamistaId) {

        console.error(
            "No hay sesión iniciada."
        );

        return;
    }


    if (!tablaPrestamos) {

        return;
    }


    try {

        const respuesta =
            await fetch(
                "http://localhost:8080/api/v1/prestamos?prestamistaId=" +
                prestamistaId,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener los préstamos"
            );
        }


        const prestamos =
            await respuesta.json();


        console.log(
            "Préstamos obtenidos:",
            prestamos
        );


        prestamosCargados =
            prestamos;


        mostrarPrestamos(
            prestamos
        );


    } catch (error) {

        console.error(
            "Error al cargar préstamos:",
            error
        );


        tablaPrestamos.innerHTML =
            "<tr>" +
            "<td colspan='8'>" +
            "Error al cargar los préstamos" +
            "</td>" +
            "</tr>";
    }
}



// ========================================
// MOSTRAR PRÉSTAMOS
// ========================================

function mostrarPrestamos(prestamos) {

    const tablaPrestamos =
        document.getElementById(
            "tablaPrestamos"
        );


    if (!tablaPrestamos) {

        return;
    }


    tablaPrestamos.innerHTML =
        "";


    if (prestamos.length === 0) {

        tablaPrestamos.innerHTML =
            "<tr>" +
            "<td colspan='8'>" +
            "No hay préstamos registrados" +
            "</td>" +
            "</tr>";

        return;
    }


    prestamos.forEach(
        function(prestamo) {

            const fila =
                document.createElement(
                    "tr"
                );


            let nombreCliente =
                "Cliente";


            if (
                prestamo.cliente &&
                prestamo.cliente.nombre
            ) {

                nombreCliente =
                    prestamo.cliente.nombre;
            }


            const capital =
                Number(
                    prestamo.montoCapital ||
                    0
                );


            const recargo =
                Number(
                    prestamo.porcentajeRecargo ||
                    0
                );


            const total =
                Number(
                    prestamo.montoTotalActual ||
                    0
                );


            let frecuencia =
                prestamo.frecuencia ||
                "-";


            if (
                frecuencia === "DIARIO"
            ) {

                frecuencia =
                    "Diario";

            } else if (
                frecuencia === "SEMANAL"
            ) {

                frecuencia =
                    "Semanal";

            } else if (
                frecuencia === "QUINCENAL"
            ) {

                frecuencia =
                    "Quincenal";

            } else if (
                frecuencia === "MENSUAL"
            ) {

                frecuencia =
                    "Mensual";
            }


            let vencimiento =
                "-";


            if (
                prestamo.fechaVencimiento
            ) {

                const fecha =
                    new Date(
                        prestamo.fechaVencimiento
                    );


                vencimiento =
                    fecha.toLocaleDateString(
                        "es-AR"
                    );
            }


            let claseEstado =
                "activo";


            let textoEstado =
                prestamo.estado ||
                "ACTIVO";


            if (
                prestamo.estado ===
                "EN_MORA"
            ) {

                claseEstado =
                    "mora";

                textoEstado =
                    "En mora";


            } else if (
                prestamo.estado ===
                "CANCELADO"
            ) {

                claseEstado =
                    "bloqueado";

                textoEstado =
                    "Cancelado";


            } else {

                textoEstado =
                    "Activo";
            }


            fila.innerHTML =
                "<td>" +
                nombreCliente +
                "</td>" +

                "<td>$ " +
                capital.toLocaleString(
                    "es-AR"
                ) +
                "</td>" +

                "<td>" +
                recargo +
                "%</td>" +

                "<td>$ " +
                total.toLocaleString(
                    "es-AR"
                ) +
                "</td>" +

                "<td>" +
                frecuencia +
                "</td>" +

                "<td>" +
                vencimiento +
                "</td>" +

                "<td>" +

                "<span class='estado " +
                claseEstado +
                "'>" +

                textoEstado +

                "</span>" +

                "</td>" +

                "<td>" +

                "<button " +
                "class='btn-tabla' " +
                "onclick='verPrestamo(" +
                prestamo.id +
                ")'>" +
                "Ver" +
                "</button>" +

                "</td>";


            tablaPrestamos.appendChild(
                fila
            );
        }
    );
}



// ========================================
// VER PRÉSTAMO
// ========================================

function verPrestamo(id) {

    const prestamo =
        prestamosCargados.find(
            function(prestamo) {

                return prestamo.id === id;
            }
        );


    if (!prestamo) {

        alert(
            "No se encontró la información del préstamo."
        );

        return;
    }



    // CLIENTE

    let nombreCliente =
        "-";


    if (
        prestamo.cliente &&
        prestamo.cliente.nombre
    ) {

        nombreCliente =
            prestamo.cliente.nombre;
    }


    document.getElementById(
        "detalleCliente"
    ).textContent =
        nombreCliente;



    // CAPITAL

    document.getElementById(
        "detalleCapital"
    ).textContent =
        "$ " +
        Number(
            prestamo.montoCapital || 0
        ).toLocaleString(
            "es-AR"
        );



    // RECARGO

    document.getElementById(
        "detalleRecargo"
    ).textContent =
        Number(
            prestamo.porcentajeRecargo || 0
        ) +
        "%";



    // TOTAL

    document.getElementById(
        "detalleTotal"
    ).textContent =
        "$ " +
        Number(
            prestamo.montoTotalActual || 0
        ).toLocaleString(
            "es-AR"
        );



    // FRECUENCIA

    let frecuencia =
        prestamo.frecuencia || "-";


    if (
        frecuencia === "DIARIO"
    ) {

        frecuencia =
            "Diario";

    } else if (
        frecuencia === "SEMANAL"
    ) {

        frecuencia =
            "Semanal";

    } else if (
        frecuencia === "QUINCENAL"
    ) {

        frecuencia =
            "Quincenal";

    } else if (
        frecuencia === "MENSUAL"
    ) {

        frecuencia =
            "Mensual";
    }


    document.getElementById(
        "detalleFrecuencia"
    ).textContent =
        frecuencia;



    // FECHA DE INICIO

    let fechaInicio =
        "-";


    if (
        prestamo.fechaInicio
    ) {

        const fecha =
            new Date(
                prestamo.fechaInicio
            );


        fechaInicio =
            fecha.toLocaleDateString(
                "es-AR"
            );
    }


    document.getElementById(
        "detalleFechaInicio"
    ).textContent =
        fechaInicio;



    // FECHA DE VENCIMIENTO

    let fechaVencimiento =
        "-";


    if (
        prestamo.fechaVencimiento
    ) {

        const fecha =
            new Date(
                prestamo.fechaVencimiento
            );


        fechaVencimiento =
            fecha.toLocaleDateString(
                "es-AR"
            );
    }


    document.getElementById(
        "detalleFechaVencimiento"
    ).textContent =
        fechaVencimiento;



    // RENOVACIONES

    document.getElementById(
        "detalleRenovaciones"
    ).textContent =
        prestamo.cantidadRenovaciones ||
        0;



    // ESTADO

    let estado =
        prestamo.estado ||
        "-";


    if (
        estado === "ACTIVO"
    ) {

        estado =
            "Activo";

    } else if (
        estado === "EN_MORA"
    ) {

        estado =
            "En mora";

    } else if (
        estado === "CANCELADO"
    ) {

        estado =
            "Cancelado";
    }


    document.getElementById(
        "detalleEstado"
    ).textContent =
        estado;



    // MOSTRAR MODAL

    const modal =
        document.getElementById(
            "modalPrestamo"
        );


    if (modal) {

        modal.style.display =
            "flex";
    }
}



// ========================================
// CERRAR MODAL PRÉSTAMO
// ========================================

const modalPrestamo =
    document.getElementById(
        "modalPrestamo"
    );


const btnCerrarModalPrestamo =
    document.getElementById(
        "btnCerrarModalPrestamo"
    );


const btnCerrarModalPrestamoFooter =
    document.getElementById(
        "btnCerrarModalPrestamoFooter"
    );



if (btnCerrarModalPrestamo) {

    btnCerrarModalPrestamo.addEventListener(
        "click",
        function() {

            modalPrestamo.style.display =
                "none";
        }
    );
}


if (btnCerrarModalPrestamoFooter) {

    btnCerrarModalPrestamoFooter.addEventListener(
        "click",
        function() {

            modalPrestamo.style.display =
                "none";
        }
    );
}


if (modalPrestamo) {

    modalPrestamo.addEventListener(
        "click",
        function(evento) {

            if (
                evento.target ===
                modalPrestamo
            ) {

                modalPrestamo.style.display =
                    "none";
            }
        }
    );
}



// ========================================
// INICIAR TABLA DE PRÉSTAMOS
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const tablaPrestamos =
            document.getElementById(
                "tablaPrestamos"
            );


        if (tablaPrestamos) {

            cargarPrestamos();
        }
    }
);



// ========================================
// BOTÓN VER TODOS
// ========================================

const verTodos =
    document.getElementById(
        "verTodos"
    );


if (verTodos) {

    verTodos.addEventListener(
        "click",
        function() {

            window.location.href =
                "pages/prestamos.html";
        }
    );
}



// ========================================
// RENOVAR PRÉSTAMO
// ========================================

const btnRenovarPrestamo =
    document.getElementById(
        "btnRenovarPrestamo"
    );


if (btnRenovarPrestamo) {

    btnRenovarPrestamo.addEventListener(
        "click",
        async function() {

            const detalleCliente =
                document.getElementById(
                    "detalleCliente"
                ).textContent;


            const prestamo =
                prestamosCargados.find(
                    function(prestamo) {

                        return (
                            prestamo.cliente &&
                            prestamo.cliente.nombre ===
                            detalleCliente
                        );
                    }
                );


            if (!prestamo) {

                alert(
                    "No se pudo identificar el préstamo."
                );

                return;
            }


            const montoAbonado =
                prompt(
                    "Ingresá el monto abonado para renovar el préstamo:"
                );


            if (
                montoAbonado === null
            ) {

                return;
            }


            const monto =
                Number(
                    montoAbonado
                );


            if (
                montoAbonado.trim() === "" ||
                isNaN(monto) ||
                monto <= 0
            ) {

                alert(
                    "Ingresá un monto válido."
                );

                return;
            }


            const confirmar =
                confirm(
                    "¿Confirmás la renovación del préstamo?\n\n" +
                    "Monto abonado: $ " +
                    monto.toLocaleString(
                        "es-AR"
                    )
                );


            if (!confirmar) {

                return;
            }


            const token =
                localStorage.getItem(
                    "jwtToken"
                );


            const prestamistaId =
                localStorage.getItem(
                    "prestamistaId"
                );


            try {

                const url =
                    "http://localhost:8080/api/v1/prestamos/" +
                    prestamo.id +
                    "/renovar" +
                    "?prestamistaId=" +
                    prestamistaId +
                    "&montoAbonado=" +
                    monto;


                const respuesta =
                    await fetch(
                        url,
                        {
                            method: "POST",

                            headers: {
                                "Authorization":
                                    "Bearer " + token
                            }
                        }
                    );


                if (!respuesta.ok) {

                    const textoError =
                        await respuesta.text();


                    console.error(
                        "Respuesta del servidor:",
                        textoError
                    );


                    throw new Error(
                        "No se pudo renovar el préstamo."
                    );
                }


                const pago =
                    await respuesta.json();


                console.log(
                    "Renovación registrada:",
                    pago
                );


                alert(
                    "Préstamo renovado correctamente."
                );


                if (modalPrestamo) {

                    modalPrestamo.style.display =
                        "none";
                }


                await cargarPrestamos();


                if (
                    typeof cargarDashboard ===
                    "function"
                ) {

                    cargarDashboard();
                }


            } catch (error) {

                console.error(
                    "Error al renovar préstamo:",
                    error
                );


                alert(
                    "Ocurrió un error al renovar el préstamo."
                );
            }
        }
    );
}



// ========================================
// CANCELAR PRÉSTAMO TOTAL
// ========================================

const btnCancelarPrestamoTotal =
    document.getElementById(
        "btnCancelarPrestamoTotal"
    );


if (btnCancelarPrestamoTotal) {

    btnCancelarPrestamoTotal.addEventListener(
        "click",
        async function() {

            const detalleCliente =
                document.getElementById(
                    "detalleCliente"
                ).textContent;


            const prestamo =
                prestamosCargados.find(
                    function(prestamo) {

                        return (
                            prestamo.cliente &&
                            prestamo.cliente.nombre ===
                            detalleCliente
                        );
                    }
                );


            if (!prestamo) {

                alert(
                    "No se pudo identificar el préstamo."
                );

                return;
            }


            const montoAbonado =
                prompt(
                    "Ingresá el monto abonado para cancelar el préstamo:"
                );


            if (
                montoAbonado === null
            ) {

                return;
            }


            const monto =
                Number(
                    montoAbonado
                );


            if (
                montoAbonado.trim() === "" ||
                isNaN(monto) ||
                monto <= 0
            ) {

                alert(
                    "Ingresá un monto válido."
                );

                return;
            }


            const confirmar =
                confirm(
                    "¿Confirmás la cancelación total del préstamo?\n\n" +
                    "Monto abonado: $ " +
                    monto.toLocaleString(
                        "es-AR"
                    ) +
                    "\n\n" +
                    "Esta operación marcará el préstamo como CANCELADO."
                );


            if (!confirmar) {

                return;
            }


            const token =
                localStorage.getItem(
                    "jwtToken"
                );


            const prestamistaId =
                localStorage.getItem(
                    "prestamistaId"
                );


            try {

                const url =
                    "http://localhost:8080/api/v1/prestamos/" +
                    prestamo.id +
                    "/cancelar" +
                    "?prestamistaId=" +
                    prestamistaId +
                    "&montoAbonado=" +
                    monto;


                const respuesta =
                    await fetch(
                        url,
                        {
                            method: "POST",

                            headers: {
                                "Authorization":
                                    "Bearer " + token
                            }
                        }
                    );


                if (!respuesta.ok) {

                    const textoError =
                        await respuesta.text();


                    console.error(
                        "Respuesta del servidor:",
                        textoError
                    );


                    throw new Error(
                        "No se pudo cancelar el préstamo."
                    );
                }


                const pago =
                    await respuesta.json();


                console.log(
                    "Cancelación registrada:",
                    pago
                );


                alert(
                    "Préstamo cancelado correctamente."
                );


                if (modalPrestamo) {

                    modalPrestamo.style.display =
                        "none";
                }


                await cargarPrestamos();


                if (
                    typeof cargarDashboard ===
                    "function"
                ) {

                    cargarDashboard();
                }


            } catch (error) {

                console.error(
                    "Error al cancelar préstamo:",
                    error
                );


                alert(
                    "Ocurrió un error al cancelar el préstamo."
                );
            }
        }
    );
}

