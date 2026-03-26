let modoRegistro = false;

function mostrarLogin() {
    modoRegistro = false;
    document.getElementById("tituloForm").textContent = "Iniciar Sesión";
    document.getElementById("botonAccion").textContent = "Entrar al Sistema";
    
    // Quitamos la clase active de todos y se la damos al pulsado
    document.querySelectorAll('.btn-tab').forEach(btn => btn.classList.remove('active'));
    // Buscamos el botón de entrar (puedes añadirle un id o usar el orden)
    document.querySelectorAll('.btn-tab')[0].classList.add('active');
}

function mostrarRegistro() {
    modoRegistro = true;
    document.getElementById("tituloForm").textContent = "Crear Cuenta Nueva";
    document.getElementById("botonAccion").textContent = "Registrar Usuario";
    
    document.querySelectorAll('.btn-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.btn-tab')[1].classList.add('active');
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
        } else if (userNombre.length < 3 || userPass.length < 4) {
            mensaje.textContent = "Mínimo 3 letras de usuario y 4 de clave.";
        } else {
            usuarios.push({ nombre: userNombre, pass: userPass });
            localStorage.setItem("listaUsuarios", JSON.stringify(usuarios));
            alert("¡Usuario creado con éxito!");
            location.reload(); 
        }
    } else {
        let usuarioEncontrado = usuarios.find(u => u.nombre === userNombre && u.pass === userPass);
        if (usuarioEncontrado) {
            document.getElementById("login").style.display = "none";
            document.getElementById("panel").style.display = "flex"; 
            document.getElementById("nombreUsuarioCargado").textContent = userNombre;
            sessionStorage.setItem("usuarioActual", userNombre);
            verSeccion('inicio'); // Carga algo por defecto
        } else {
            mensaje.textContent = "Usuario o contraseña incorrectos.";
        }
    }
}

function verSeccion(tipo) {
    let caja = document.getElementById("contenidoSeccion");
    
    if (tipo === 'tareas') {
        let tareasActuales = cargarDeDisco('tareas');
        caja.innerHTML = `
            <h2>✅ Mis Tareas</h2>
            <div style="margin: 15px 0;">
                <input type="text" id="nuevaTarea" placeholder="¿Qué hay que hacer?" style="width: 70%; padding:10px;">
                <button onclick="añadirTarea()" class="btn-glow" style="width: 25%; margin: 0; padding: 10px;">Añadir</button>
            </div>
            <ul id="listaTareas" style="list-style: none; padding: 0;">
                ${tareasActuales.map((t, i) => `
                    <li style="background: #21262d; margin: 5px 0; padding: 10px; border-radius: 5px; display: flex; justify-content: space-between;">
                        ${t} <button onclick="borrarTarea(${i})" style="background:none; border:none; color:#f85149; cursor:pointer;">✖</button>
                    </li>
                `).join('')}
            </ul>
        `;
    } else if (tipo === 'juegos') {
        caja.innerHTML = `<h2>🎮 Biblioteca de Juegos</h2><p>Próximamente...</p>`;
    } else if (tipo === 'notas') {
        caja.innerHTML = `<h2>📝 Mis Notas</h2><p>Próximamente...</p>`;
    } else {
        caja.innerHTML = `<h2>Bienvenido</h2><p>Selecciona una categoría arriba.</p>`;
    }
}

// --- FUNCIONES DE PERSISTENCIA (EL AUTOGUARDADO) ---

function guardarEnDisco(seccion, datos) {
    let usuarioActual = sessionStorage.getItem("usuarioActual");
    if (!usuarioActual) return;

    let todosLosDatos = JSON.parse(localStorage.getItem("datos_" + usuarioActual)) || {
        tareas: [], juegos: [], notas: [], guardados: []
    };

    todosLosDatos[seccion] = datos;
    localStorage.setItem("datos_" + usuarioActual, JSON.stringify(todosLosDatos));
}

function cargarDeDisco(seccion) {
    let usuarioActual = sessionStorage.getItem("usuarioActual");
    if (!usuarioActual) return [];

    let todosLosDatos = JSON.parse(localStorage.getItem("datos_" + usuarioActual)) || {};
    return todosLosDatos[seccion] || [];
}

function añadirTarea() {
    let input = document.getElementById("nuevaTarea");
    let texto = input.value;
    if (texto === "") return;

    let tareas = cargarDeDisco('tareas');
    tareas.push(texto);
    
    guardarEnDisco('tareas', tareas);
    verSeccion('tareas'); 
}

function borrarTarea(indice) {
    let tareas = cargarDeDisco('tareas');
    tareas.splice(indice, 1);
    
    guardarEnDisco('tareas', tareas);
    verSeccion('tareas');
}

function cerrarSesion() {
    sessionStorage.removeItem("usuarioActual");
    location.reload();
}