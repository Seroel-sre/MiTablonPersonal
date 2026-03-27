// --- 1. CONFIGURACIÓN INICIAL ---
let modoRegistro = false;

window.onload = function() {
    let usuarioGuardado = localStorage.getItem("usuarioActual");
    if (usuarioGuardado) {
        document.getElementById("login").style.display = "none";
        document.getElementById("panel").style.display = "flex";
        document.getElementById("nombreUsuarioCargado").textContent = usuarioGuardado;
        verSeccion('inicio'); 
    }
};

// --- 2. LOGIN Y REGISTRO ---
function mostrarLogin() {
    modoRegistro = false;
    document.getElementById("tituloForm").textContent = "Iniciar Sesión";
    document.getElementById("botonAccion").textContent = "Entrar al Sistema";
}

function mostrarRegistro() {
    modoRegistro = true;
    document.getElementById("tituloForm").textContent = "Crear Cuenta Nueva";
    document.getElementById("botonAccion").textContent = "Registrar Usuario";
}

function acceder() {
    let userNombre = document.getElementById("usuario").value;
    let userPass = document.getElementById("password").value;
    let mensaje = document.getElementById("mensaje");
    let usuarios = JSON.parse(localStorage.getItem("listaUsuarios")) || [];

    if (modoRegistro) {
        let existe = usuarios.find(u => u.nombre === userNombre);
        if (existe) {
            mensaje.textContent = "Error: El usuario ya existe.";
        } else {
            usuarios.push({ nombre: userNombre, pass: userPass });
            localStorage.setItem("listaUsuarios", JSON.stringify(usuarios));
            alert("¡Usuario creado!");
            location.reload(); 
        }
    } else {
        let usuarioEncontrado = usuarios.find(u => u.nombre === userNombre && u.pass === userPass);
        if (usuarioEncontrado) {
            localStorage.setItem("usuarioActual", userNombre);
            location.reload();
        } else {
            mensaje.textContent = "Usuario o contraseña incorrectos.";
        }
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    location.reload();
}

// --- 3. MOTOR DE GUARDADO ---
function guardarEnDisco(seccion, datos) {
    let usuarioActual = localStorage.getItem("usuarioActual");
    if (!usuarioActual) return;

    let todosLosDatos = JSON.parse(localStorage.getItem("datos_" + usuarioActual)) || {
        tareas: [], juegos: [], notas: []
    };

    todosLosDatos[seccion] = datos;
    localStorage.setItem("datos_" + usuarioActual, JSON.stringify(todosLosDatos));
}

function cargarDeDisco(seccion) {
    let usuarioActual = localStorage.getItem("usuarioActual");
    if (!usuarioActual) return [];

    let todosLosDatos = JSON.parse(localStorage.getItem("datos_" + usuarioActual)) || {};
    return todosLosDatos[seccion] || [];
}

// --- 4. NAVEGACIÓN ---
function verSeccion(tipo) {
    let caja = document.getElementById("contenidoSeccion");
    
    if (tipo === 'tareas') {
        let tareas = cargarDeDisco('tareas');
        caja.innerHTML = `
            <h2>✅ Mis Tareas</h2>
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <input type="text" id="nuevaTarea" placeholder="¿Qué hay que hacer?" style="flex:1;">
                <button onclick="añadirTarea()" class="btn-glow" style="width:100px; margin:0;">Añadir</button>
            </div>
            <ul style="list-style:none; padding:0;">
                ${tareas.map((t, i) => `
                    <li style="background:#21262d; padding:10px; margin-bottom:5px; border-radius:5px; display:flex; justify-content:space-between;">
                        ${t} <button onclick="borrarTarea(${i})" style="color:red; background:none; border:none; cursor:pointer;">✖</button>
                    </li>
                `).join('')}
            </ul>
        `;
    } 
    else if (tipo === 'juegos') {
        let juegos = cargarDeDisco('juegos');
        caja.innerHTML = `
            <h2>🎮 Mi Biblioteca</h2>
            <table class="tabla-juegos" style="width:100%; border-collapse:collapse; margin-top:15px;">
                <thead>
                    <tr style="background:#21262d;">
                        <th style="padding:10px;"><input type="text" id="nuevoJuego" placeholder="Juego..." style="width:100%; border:none; background:transparent; color:white;"></th>
                        <th style="padding:10px; border-left:1px solid #333;"><input type="text" id="espacioLibre" placeholder="Notas..." style="width:100%; border:none; background:transparent; color:white;"></th>
                        <th style="padding:10px; border-left:1px solid #333; text-align:center;"><button onclick="añadirJuego()" class="btn-glow" style="margin:0; padding:5px 10px;">Añadir</button></th>
                    </tr>
                </thead>
                <tbody>
                    ${juegos.map((j, i) => `
                        <tr class="${j.completado ? 'fila-completada' : ''}" style="border-bottom:1px solid #333;">
                            <td style="padding:10px;">${j.nombre}</td>
                            <td style="padding:10px; border-left:1px solid #333; color:#8b949e;">${j.extra || ''}</td>
                            <td style="padding:10px; border-left:1px solid #333; text-align:center;">
                                <input type="checkbox" ${j.completado ? 'checked' : ''} onchange="toggleJuego(${i})">
                                <button onclick="borrarJuego(${i})" style="color:red; background:none; border:none; margin-left:10px; cursor:pointer;">✖</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        caja.innerHTML = `<h2>Bienvenido</h2><p>Selecciona una sección para empezar.</p>`;
    }
}

// --- 5. FUNCIONES DE LOS BOTONES ---
function añadirTarea() {
    let val = document.getElementById("nuevaTarea").value;
    if (!val) return;
    let lista = cargarDeDisco('tareas');
    lista.push(val);
    guardarEnDisco('tareas', lista);
    verSeccion('tareas');
}

function borrarTarea(i) {
    let lista = cargarDeDisco('tareas');
    lista.splice(i, 1);
    guardarEnDisco('tareas', lista);
    verSeccion('tareas');
}

function añadirJuego() {
    let nom = document.getElementById("nuevoJuego").value;
    let ext = document.getElementById("espacioLibre").value;
    if (!nom) return;
    let lista = cargarDeDisco('juegos');
    lista.push({ nombre: nom, extra: ext, completado: false });
    guardarEnDisco('juegos', lista);
    verSeccion('juegos');
}

function toggleJuego(i) {
    let lista = cargarDeDisco('juegos');
    lista[i].completado = !lista[i].completado;
    guardarEnDisco('juegos', lista);
    verSeccion('juegos');
}

function borrarJuego(i) {
    let lista = cargarDeDisco('juegos');
    lista.splice(i, 1);
    guardarEnDisco('juegos', lista);
    verSeccion('juegos');
}