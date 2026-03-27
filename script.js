// --- 1. CONFIGURACIÓN INICIAL Y VARIABLES ---
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

// --- 2. GESTIÓN DE INTERFAZ (LOGIN/REGISTRO) ---
function mostrarLogin() {
    modoRegistro = false;
    document.getElementById("tituloForm").textContent = "Iniciar Sesión";
    document.getElementById("botonAccion").textContent = "Entrar al Sistema";
    document.querySelectorAll('.btn-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.btn-tab')[0].classList.add('active');
}

function mostrarRegistro() {
    modoRegistro = true;
    document.getElementById("tituloForm").textContent = "Crear Cuenta Nueva";
    document.getElementById("botonAccion").textContent = "Registrar Usuario";
    document.querySelectorAll('.btn-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.btn-tab')[1].classList.add('active');
}

// --- 3. LÓGICA DE ACCESO ---
function acceder() {
    let userNombre = document.getElementById("usuario").value;
    let userPass = document.getElementById("password").value;
    let mensaje = document.getElementById("mensaje");
    let usuarios = JSON.parse(localStorage.getItem("listaUsuarios")) || [];

    if (modoRegistro) {
        let existe = usuarios.find(u => u.nombre === userNombre);
        if (existe) {
            mensaje.textContent = "Error: El usuario ya existe.";
        } else if (userNombre.length < 3 || userPass.length < 4) {
            mensaje.textContent = "Mínimo 3 letras de usuario y 4 de clave.";
        } else {
            usuarios.push({ nombre: userNombre, pass: userPass });
            localStorage.setItem("listaUsuarios", JSON.stringify(usuarios));
            alert("¡Usuario creado con éxito! Ya puedes entrar.");
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

// --- 4. MOTOR DE PERSISTENCIA ---
function guardarEnDisco(seccion, datos) {
    let usuarioActual = localStorage.getItem("usuarioActual");
    if (!usuarioActual) return;

    let todosLosDatos = JSON.parse(localStorage.getItem("datos_" + usuarioActual)) || {
        tareas: [], juegos: [], notas: [], guardados: []
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

// --- 5. NAVEGACIÓN Y SECCIONES ---
function verSeccion(tipo) {
    let caja = document.getElementById("contenidoSeccion");
    
    if (tipo === 'tareas') {
        let tareasActuales = cargarDeDisco('tareas');
        caja.innerHTML = `
            <h2>✅ Mis Tareas</h2>
            <div style="margin: 15px 0; display: flex; gap: 10px;">
                <input type="text" id="nuevaTarea" placeholder="¿Qué hay que hacer?" style="flex-grow: 1; padding:10px;">
                <button onclick="añadirTarea()" class="btn-glow" style="width: 100px; margin: 0;">Añadir</button>
            </div>
            <ul id="listaTareas" style="list-style: none; padding: 0;">
                ${tareasActuales.map((t, i) => `
                    <li style="background: #21262d; margin: 5px 0; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; border: 1px solid #30363d;">
                        ${t} <button onclick="borrarTarea(${i})" style="background:none; border:none; color:#f85149; cursor:pointer; font-weight:bold;">✖</button>
                    </li>
                `).join('')}
            </ul>
        `;
    } 
    else if (tipo === 'juegos') {
        let juegosActuales = cargarDeDisco('juegos');
        caja.innerHTML = `
            <h2>🎮 Mi Biblioteca</h2>
            <div style="margin: 15px 0; display: flex; gap: 10px;">
                <input type="text" id="nuevoJuego" placeholder="Nombre del juego..." style="flex-grow: 1; padding:10px;">
                <button onclick="añadirJuego()" class="btn-glow" style="width: 100px; margin: 0;">Añadir</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px;">
                ${juegosActuales.map((j, i) => `
                    <div style="background: #161b22; padding: 15px; border-radius: 10px; border: 1px solid #30363d; text-align: center; position: relative;">
                        <span style="font-size: 30px;">🕹️</span>
                        <p style="margin-top: 8px; font-size: 14px;">${j}</p>
                        <button onclick="borrarJuego(${i})" style="position: absolute; top: 5px; right: 5px; background:none; border:none; color:#f85149; cursor:pointer;">✖</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    else {
        caja.innerHTML = `
            <h2>Panel de Control</h2>
            <p>Selecciona una categoría para empezar a organizar tu vida.</p>
        `;
    }
}

// --- 6. FUNCIONES DE ACCIÓN ---
function añadirTarea() {
    let input = document.getElementById("nuevaTarea");
    if (!input || input.value.trim() === "") return;
    let lista = cargarDeDisco('tareas');
    lista.push(input.value);
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
    let input = document.getElementById("nuevoJuego");
    if (!input || input.value.trim() === "") return;
    let lista = cargarDeDisco('juegos');
    lista.push(input.value);
    guardarEnDisco('juegos', lista);
    verSeccion('juegos');
}

function borrarJuego(i) {
    let lista = cargarDeDisco('juegos');
    lista.splice(i, 1);
    guardarEnDisco('juegos', lista);
    verSeccion('juegos');
}