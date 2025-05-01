const canvas = document.getElementById("simulacionCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

let x = canvas.width / 2;
let y = canvas.height / 2;
let velocidad = 0;  // Inicializamos la velocidad en 0
let campoDireccion = "derecha";
let moviendo = false;

function calcularMRU(val1, val2) {
    return val1 / val2; 
}

function preDibujarSimulacion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    x = canvas.width / 2;
    y = canvas.height / 2;

    dibujarAuto(x, y, "pink");
    dibujarRecta(campoDireccion);
}

function dibujarAuto(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x - 20, y - 10, 40, 20);

    ctx.fillStyle = "lightblue";
    ctx.fillRect(x - 10, y - 20, 20, 10);

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x - 15, y + 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 15, y + 10, 5, 0, Math.PI * 2);
    ctx.fill();
}

function verificarValores() {
    let velocidadInput = document.getElementById("velocidad").value;
    let tiempoInput = document.getElementById("tiempo").value;

    if (velocidadInput === "" || tiempoInput === "" || velocidadInput === "0" || tiempoInput === "0" || parseFloat(velocidadInput) < 0 || parseFloat(tiempoInput) < 0) {
        Swal.fire({ icon: "error", title: "Error", text: "No puedes tener valores nulos o menores a 1" });
        return false;
    }
    return true;
}

function iniciarSimulacion() {
    if (verificarValores()) {
        let velocidadInput = parseFloat(document.getElementById("velocidad").value);
        let tiempoInput = parseFloat(document.getElementById("tiempo").value);
        let distancia = calcularMRU(velocidadInput, tiempoInput);
       
        velocidad = velocidadInput; // Asignamos la velocidad ingresada por el usuario
        moviendo = true;
        requestAnimationFrame(actualizarSimulacion);
    }
}

function actualizarSimulacion() {
    if (moviendo) {
        let tiempo = 0.1; 
        let desplazamiento = velocidad * tiempo * 0.5 + 20; 

        if (campoDireccion === "derecha") {
            x += desplazamiento;
        } else {
            x -= desplazamiento;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarAuto(x, y, "pink");
        dibujarRecta(campoDireccion);

        if ((campoDireccion === "derecha" && x > canvas.width - 20) || (campoDireccion === "izquierda" && x < 20)) {
            detenerSimulacion();
        } else {
            requestAnimationFrame(actualizarSimulacion);
        }
    }
}

function detenerSimulacion() {
    document.getElementById("borrar").hidden = false;
    let velocidadInput = parseFloat(document.getElementById("velocidad").value);
    let tiempoInput = parseFloat(document.getElementById("tiempo").value);
    let distancia = calcularMRU(velocidadInput, tiempoInput);
    document.getElementById("resultado").innerHTML = `La distancia recorrida es: ${distancia} km`;
    moviendo = false;
    if (!document.getElementById("btnGrafica")) {
        let mostrar = document.getElementById("contenedor").appendChild(document.createElement("button"));
        mostrar.innerHTML = "Mostrar gráfica";
        mostrar.id = "btnGrafica";
      }
    
    preDibujarSimulacion();
}

function dibujarRecta(direccion) {
    ctx.strokeStyle = "lightgreen";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (direccion === "derecha") {
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
    } else {
        ctx.moveTo(canvas.width, canvas.height / 2);
        ctx.lineTo(0, canvas.height / 2);
    }
    ctx.stroke();
}

preDibujarSimulacion();
