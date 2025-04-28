const canvas = document.getElementById("simulacionCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;
document.getElementById("guardar").hidden = false;

function CalcularSinCanva(vel, temp) {
  return vel / temp;
}

window.onload = function (){
localStorage.clear();
}

function borrar(){
  localStorage.clear();
  document.getElementById("guardar").hidden = false;
  document.getElementById("iniciar").hidden = true;
  document.getElementById("borrar").hidden = true;
  document.getElementById("resultado").innerHTML = "";
  document.getElementById("btnGrafica").remove();F
  preDibujarSimulacion();
}

function getDataFromLocalStorage() {
  let datosA1 = JSON.parse(localStorage.getItem("auto1"));
  let datosA2 = JSON.parse(localStorage.getItem("auto2"));
  return { auto1: datosA1, auto2: datosA2 };
}

function getTime() {
  let { auto1, auto2 } = getDataFromLocalStorage();
  return `${auto1.tiempo},${auto2.tiempo}`;
}

function getVel() {
  let { auto1, auto2 } = getDataFromLocalStorage();
  return `${auto1.velocidad},${auto2.velocidad}`;
}

function verificarTipo() {
  let MtoKm = document.getElementById("medida").value;
  let Hms = document.getElementById("tmp").value;
  return (MtoKm === "km" && Hms === "horas") || (MtoKm === "m" && Hms === "segundos");
}

function almacenarMedidas() {
  let { auto1 } = getDataFromLocalStorage();
  let medidas = auto1.medida === "km" ? "km/h" : "m/s";
  return medidas;
}

function calcular() {
  if (verificarTipo()) {
    let velocidades = getVel().split(",");
    let tiempos = getTime().split(",");
    let res1 = CalcularSinCanva(velocidades[0], tiempos[0]);
    let res2 = CalcularSinCanva(velocidades[1], tiempos[1]);
    return `La distancia recorrida por el auto rosa es: ${res1} ${almacenarMedidas()};por el rojo ${res2} ${almacenarMedidas()}`;
  } else {
    return "Error, verifica las unidades de medida seleccionadas";
  }
}

let x1 = canvas.width / 2;
let x2 = canvas.width / 2 + 100;
let y = canvas.height / 2;
let velocidad = 0;
let campoDireccion = "derecha";
let moviendo = false;
let aceleracion = 0;

function preDibujarSimulacion() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  x1 = canvas.width / 2;
  x2 = canvas.width / 2 + 100;
  y = canvas.height / 2;

  dibujarAuto(x1, y, "pink");
  dibujarAuto(x2, y, "red");

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

function guardarDatos() {
  let iteraciones = parseInt(localStorage.getItem("contadorAutos")) || 0;
  let velocidadInput = document.getElementById("velocidad").value;
  let tiempoInput = document.getElementById("tiempo").value;

  if (velocidadInput === "0" || tiempoInput === "0") {
    Swal.fire({ icon: "error", title: "Error", text: "No puedes tener valores 0" });
    return;
  }

  if (velocidadInput === "" || tiempoInput === "") {
    Swal.fire({ icon: "error", title: "Error", text: "No puedes tener valores nulos" });
    return;
  }

  if (iteraciones >= 2) {
    Swal.fire({ icon: "error", title: "Error", text: "No se pueden enviar más datos" });
    return;
  }

  let datosAuto = {};
  document.querySelectorAll("input").forEach((input) => {
    datosAuto[input.id] = input.value;
  });
  document.querySelectorAll("select").forEach((select) => {
    datosAuto[select.id] = select.value;
  });

  localStorage.setItem(`auto${iteraciones + 1}`, JSON.stringify(datosAuto));
  localStorage.setItem("contadorAutos", iteraciones + 1);

  document.getElementById("velocidad").value = "";
  document.getElementById("tiempo").value = "";

  if (iteraciones + 1 >= 2) {
    document.getElementById("guardar").hidden = true;
  }

  actualizarValores();
}

async function actualizarValores() {
  let contador = parseInt(localStorage.getItem("contadorAutos")) || 0;
  let color = contador === 1 ? "rosa" : "rojo";

  Swal.fire({
    icon: "success",
    title: `Datos del auto ${color} enviados`,
    text: `Se han enviado los datos del auto ${color}`,
  });

  if (contador === 2) {
    document.getElementById("iniciar").hidden = false;
    document.getElementById("borrar").hidden = false;
  }
}

function iniciarSimulacion() {
  let { auto1, auto2 } = getDataFromLocalStorage();
  let velocidadAuto1 = parseFloat(auto1.velocidad);
  let velocidadAuto2 = parseFloat(auto2.velocidad);
  let tiempoAuto1 =  parseFloat(auto1.tiempo);
  let tiempoAuto2 = parseFloat(auto2.tiempo);
  campoDireccion = document.getElementById("direccion-campo").value;

  if (isNaN(velocidadAuto1) || velocidadAuto1 < 0 || isNaN(velocidadAuto2) || velocidadAuto2 < 0) {
    Swal.fire({ icon: "warning", title: "Oops...", text: "La velocidad de los autos no puede ser negativa o inválida." });
    return;
  }

  if (isNaN(tiempoAuto1) || tiempoAuto1 < 0 || isNaN(tiempoAuto2) || tiempoAuto2 < 0) {
    Swal.fire({ icon: "warning", title: "Oops...", text: "El tiempo no puede ser negativo o inválido." });
    return;
  }

  velocidad = { auto1: velocidadAuto1, auto2: velocidadAuto2 };
  tiempo = 0;
  moviendo = true;
  document.getElementById("resultado").innerHTML = "";
  requestAnimationFrame(actualizarSimulacion);
}

function actualizarSimulacion() {
  if (moviendo) {
    tiempo += 0.1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let desplazamientoAuto1 = velocidad.auto1 * tiempo + 0.5 * aceleracion * Math.pow(tiempo, 2);
    let desplazamientoAuto2 = velocidad.auto2 * tiempo + 0.5 * aceleracion * Math.pow(tiempo, 2);

    if (campoDireccion === "derecha") {
      x1 += desplazamientoAuto1;
      x2 += desplazamientoAuto2;
    } else {
      x1 -= desplazamientoAuto1;
      x2 -= desplazamientoAuto2;
    }

    dibujarAuto(x1, y, "pink");
    dibujarAuto(x2, y, "red");
    dibujarRecta(campoDireccion);

    if ((campoDireccion === "derecha" && x1 > canvas.width - 20) || (campoDireccion === "izquierda" && x1 < 20)) {
      detenerSimulacion();
    } else {
      requestAnimationFrame(actualizarSimulacion);
    }
  }
}

function detenerSimulacion() {
  moviendo = false;
  calcular().split(";").forEach((resultado) => {
    let resultadoDiv = document.createElement("div");
    resultadoDiv.innerHTML = resultado;
    document.getElementById("resultado").appendChild(resultadoDiv);
  })

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