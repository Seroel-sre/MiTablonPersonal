let registro = false;

window.onload = function() {
    let logueado = localStorage.getItem("sesion");
    if (logueado) {
        document.getElementById("login").style.display = "none";
        document.getElementById("panel").style.display = "block";
        document.getElementById("userNombre").textContent = logueado;
    }
};

function verLogin() {
    registro = false;
    document.getElementById("titulo").textContent = "Iniciar Sesión";
}

function verRegistro() {
    registro = true;
    document.getElementById("titulo").textContent = "Crear Cuenta";
}

function validar() {
    let u = document.getElementById("user").value;
    let p = document.getElementById("pass").value;
    let usuarios = JSON.parse(localStorage.getItem("db_usuarios")) || [];

    if (registro) {
        usuarios.push({nombre: u, clave: p});
        localStorage.setItem("db_usuarios", JSON.stringify(usuarios));
        alert("Registrado");
        location.reload();
    } else {
        let ok = usuarios.find(user => user.nombre === u && user.clave === p);
        if (ok) {
            localStorage.setItem("sesion", u);
            location.reload();
        } else {
            document.getElementById("error").textContent = "Error de acceso";
        }
    }
}

function salir() {
    localStorage.removeItem("sesion");
    location.reload();
}

// Función de navegación limpia
function cambiar(seccion) {
    let visor = document.getElementById("visor");
    // Todas las secciones muestran lo mismo por ahora
    visor.innerHTML = `<p style="color:gray;">La sección de ${seccion} no está disponible de momento.</p>`;
}