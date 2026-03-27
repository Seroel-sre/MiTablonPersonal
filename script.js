let modoRegistro = false;

window.onload = function() {
    let user = localStorage.getItem("usuarioActual");
    if (user) {
        document.getElementById("login").style.display = "none";
        document.getElementById("panel").style.display = "flex";
        document.getElementById("nombreUsuarioCargado").textContent = user;
    }
};

// LOGIN / REGISTRO
function mostrarLogin() { modoRegistro = false; document.getElementById("tituloForm").textContent = "Iniciar Sesión"; }
function mostrarRegistro() { modoRegistro = true; document.getElementById("tituloForm").textContent = "Crear Cuenta"; }

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
        if (ok) { localStorage.setItem("usuarioActual", u); location.reload(); }
        else { document.getElementById("mensaje").textContent = "Error de login"; }
    }
}

function cerrarSesion() { localStorage.removeItem("usuarioActual"); location.reload(); }

// GESTIÓN DE SECCIONES
function verSeccion(tipo) {
    let visor = document.getElementById("contenidoSeccion");
    visor.style.display = "block";

    if (tipo === 'tareas') {
        let lista = cargarDatos('tareas');
        visor.innerHTML = `
            <h2 style="margin-bottom:15px;">✅ Mis Tareas</h2>
            <div class="barra-entrada">
                <input type="text" id="inputTarea" style="flex:3" placeholder="Nueva tarea...">
                <input type="text" id="fechaLimite" style="flex:1; border-left:1px solid #30363d !important" placeholder="Fecha de finalización">
                <button class="btn-add" onclick="nuevaTarea()">Añadir</button>
            </div>
            ${lista.map((t, i) => `
                <div class="item-tarea">
                    <div>
                        <p style="color:#e6edf3">${t.texto}</p>
                        <div class="etiquetas">
                            <span class="fecha-creacion">Creado: ${t.fecha}</span>
                            ${t.limite ? `<span class="fecha-final">Vence: ${t.limite}</span>` : ''}
                        </div>
                    </div>
                    <button class="btn-delete" onclick="borrarDato('tareas', ${i})">✖</button>
                </div>
            `).reverse().join('')}
        `;
    } 
    
    else if (tipo === 'juegos') {
        let lista = cargarDatos('juegos');
        visor.innerHTML = `
            <h2 style="margin-bottom:15px;">🎮 Objetivos Gaming</h2>
            <div class="barra-entrada">
                <input type="text" id="nombreJuego" style="flex:1" placeholder="Nombre del juego">
                <input type="text" id="metaJuego" style="flex:2; border-left:1px solid #30363d !important" placeholder="¿Qué quieres hacer?">
                <button class="btn-add" onclick="nuevoJuego()">Añadir</button>
            </div>
            <table class="tabla-juegos">
                <thead>
                    <tr>
                        <th>Juego</th>
                        <th>Objetivo</th>
                        <th style="width:50px">Meta</th>
                        <th style="width:30px"></th>
                    </tr>
                </thead>
                <tbody>
                    ${lista.map((j, i) => `
                        <tr>
                            <td class="${j.completado ? 'tachado' : ''}">${j.nombre}</td>
                            <td class="${j.completado ? 'tachado' : ''}">${j.meta}</td>
                            <td style="text-align:center">
                                <input type="checkbox" class="check-juego" ${j.completado ? 'checked' : ''} onclick="toggleJuego(${i})">
                            </td>
                            <td>
                                <button class="btn-delete" onclick="borrarDato('juegos', ${i})">✖</button>
                            </td>
                        </tr>
                    `).reverse().join('')}
                </tbody>
            </table>
        `;
    } else {
        visor.style.display = "flex";
        visor.innerHTML = `<p style="color:gray;">Sección ${tipo} no disponible.</p>`;
    }
}

// LÓGICA TAREAS
function nuevaTarea() {
    let txt = document.getElementById("inputTarea").value;
    let f_lim = document.getElementById("fechaLimite").value;
    if (txt.trim() === "") return;
    let lista = cargarDatos('tareas');
    let hoy = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    lista.push({ texto: txt, fecha: hoy, limite: f_lim });
    guardarDatos('tareas', lista);
    verSeccion('tareas');
}

// LÓGICA JUEGOS
function nuevoJuego() {
    let nom = document.getElementById("nombreJuego").value;
    let met = document.getElementById("metaJuego").value;
    if (nom.trim() === "") return;
    let lista = cargarDatos('juegos');
    lista.push({ nombre: nom, meta: met, completado: false });
    guardarDatos('juegos', lista);
    verSeccion('juegos');
}

function toggleJuego(index) {
    let lista = cargarDatos('juegos');
    let realIndex = lista.length - 1 - index;
    lista[realIndex].completado = !lista[realIndex].completado;
    guardarDatos('juegos', lista);
    verSeccion('juegos');
}

// PERSISTENCIA GENÉRICA
function borrarDato(tipo, index) {
    let lista = cargarDatos(tipo);
    let realIndex = lista.length - 1 - index;
    lista.splice(realIndex, 1);
    guardarDatos(tipo, lista);
    verSeccion(tipo);
}

function guardarDatos(tipo, lista) {
    let user = localStorage.getItem("usuarioActual");
    localStorage.setItem(tipo + "_" + user, JSON.stringify(lista));
}

function cargarDatos(tipo) {
    let user = localStorage.getItem("usuarioActual");
    return JSON.parse(localStorage.getItem(tipo + "_" + user)) || [];
}