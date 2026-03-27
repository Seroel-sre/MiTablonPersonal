let modoRegistro = false;

window.onload = function() {
    let user = localStorage.getItem("usuarioActual");
    if (user) {
        document.getElementById("login").style.display = "none";
        document.getElementById("panel").style.display = "flex";
        document.getElementById("nombreUsuarioCargado").textContent = user;
    }
};

function mostrarLogin() {
    modoRegistro = false;
    document.getElementById("tituloForm").textContent = "Iniciar Sesión";
}

function mostrarRegistro() {
    modoRegistro = true;
    document.getElementById("tituloForm").textContent = "Crear Cuenta";
}

function acceder() {
    let u = document.getElementById("usuario").value;
    let p = document.getElementById("password").value;
    let lista = JSON.parse(localStorage.getItem("listaUsuarios")) || [];

    if (u === "" || p === "") return;

    if (modoRegistro) {
        lista.push({nombre: u, pass: p});
        localStorage.setItem("listaUsuarios", JSON.stringify(lista));
        alert("Usuario creado");
        location.reload();
    } else {
        let ok = lista.find(user => user.nombre === u && user.pass === p);
        if (ok) {
            localStorage.setItem("usuarioActual", u);
            location.reload();
        } else {
            document.getElementById("mensaje").textContent = "Error de login";
        }
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    location.reload();
}

// SECCIÓN TAREAS
function verSeccion(tipo) {
    let visor = document.getElementById("contenidoSeccion");
    visor.style.display = "block";

    if (tipo === 'tareas') {
        let lista = cargarTareas();
        visor.innerHTML = `
            <div class="seccion-header">
                <h2 style="color:white; margin-bottom:15px;">✅ Mis Tareas</h2>
                <div class="barra-tarea">
                    <input type="text" id="inputTarea" placeholder="Nueva tarea...">
                    <input type="text" id="fechaLimite" placeholder="Fecha de finalización">
                    <button class="btn-add" onclick="nuevaTarea()">Añadir</button>
                </div>
            </div>
            <div id="listaTareasContainer">
                ${lista.map((t, i) => `
                    <div class="item-tarea">
                        <div class="info-tarea">
                            <span class="texto-tarea">${t.texto}</span>
                            <div class="etiquetas">
                                <span class="fecha-creacion">Creado: ${t.fecha}</span>
                                ${t.limite ? `<span class="fecha-final">Vence: ${t.limite}</span>` : ''}
                            </div>
                        </div>
                        <button class="btn-delete" onclick="borrarTarea(${i})">✖</button>
                    </div>
                `).reverse().join('')}
            </div>
        `;
    } else {
        visor.style.display = "flex";
        visor.innerHTML = `<p style="color:gray;">Sección ${tipo} no disponible.</p>`;
    }
}

function nuevaTarea() {
    let txt = document.getElementById("inputTarea").value;
    let f_lim = document.getElementById("fechaLimite").value;
    if (txt.trim() === "") return;

    let lista = cargarTareas();
    let ahora = new Date();
    let hoy = ahora.toLocaleDateString() + " " + ahora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    lista.push({ texto: txt, fecha: hoy, limite: f_lim });
    guardarTareas(lista);
    verSeccion('tareas');
}

function borrarTarea(index) {
    let lista = cargarTareas();
    let realIndex = lista.length - 1 - index;
    lista.splice(realIndex, 1);
    guardarTareas(lista);
    verSeccion('tareas');
}

function guardarTareas(lista) {
    let user = localStorage.getItem("usuarioActual");
    localStorage.setItem("tareas_" + user, JSON.stringify(lista));
}

function cargarTareas() {
    let user = localStorage.getItem("usuarioActual");
    return JSON.parse(localStorage.getItem("tareas_" + user)) || [];
}