const canvas = document.getElementById("simulacionCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

let x = 20;
let y = canvas.height / 2;
let velocidad = 0;
let tiempoTotal = 0;
let distanciaTotal = 0;
let moviendo = false;

function calcularDistancia(vel, tiempo) {
  return vel * tiempo;
}

function calcularVelocidad(distancia, tiempo) {
  return distancia / tiempo;
}

function calcularTiempo(distancia, vel) {
  return distancia / vel;
}

function verificarValores() {
  const velInput = document.getElementById("velocidad").value;
  const tiempoInput = document.getElementById("tiempo").value;
  const distInput = document.getElementById("distancia").value;

  let vel = parseFloat(velInput);
  let tiempo = parseFloat(tiempoInput);
  let dist = parseFloat(distInput);

  let llenos = [vel, tiempo, dist].filter(v => !isNaN(v) && v > 0);

  if (llenos.length < 2) {
    Swal.fire({ icon: "error", title: "Error", text: "Debes ingresar al menos dos valores válidos mayores que 0." });
    return false;
  }
  return true;
}

function iniciarSimulacion() {
  if (!verificarValores()) return;

  let velInput = parseFloat(document.getElementById("velocidad").value);
  let tiempoInput = parseFloat(document.getElementById("tiempo").value);
  let distInput = parseFloat(document.getElementById("distancia").value);

  if (isNaN(velInput)) {
    velocidad = calcularVelocidad(distInput, tiempoInput);
    document.getElementById("velocidad").value = velocidad.toFixed(2);
  } else if (isNaN(tiempoInput)) {
    tiempoTotal = calcularTiempo(distInput, velInput);
    document.getElementById("tiempo").value = tiempoTotal.toFixed(2);
  } else if (isNaN(distInput)) {
    distanciaTotal = calcularDistancia(velInput, tiempoInput);
    document.getElementById("distancia").value = distanciaTotal.toFixed(2);
  }

  if (!isNaN(velInput)) velocidad = velInput;
  if (!isNaN(tiempoInput)) tiempoTotal = tiempoInput;
  if (!isNaN(distInput)) distanciaTotal = distInput;

  if (distanciaTotal === 0) {
    distanciaTotal = calcularDistancia(velocidad, tiempoTotal);
    document.getElementById("distancia").value = distanciaTotal.toFixed(2);
  }

  x = 20;
  moviendo = true;
  requestAnimationFrame(actualizarSimulacion);
}

function actualizarSimulacion() {
  if (!moviendo) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const kmAPixel = 200; 
  const velocidadPxPorHora = velocidad * kmAPixel;
  const framesPorSegundo = 60;
  const desplazamientoPorFrame = velocidadPxPorHora / framesPorSegundo;

  x += desplazamientoPorFrame;

  dibujarAuto(x, y, "pink");
  dibujarRecta();

  if (x >= canvas.width - 20) {
    detenerSimulacion();
  } else {
    requestAnimationFrame(actualizarSimulacion);
  }
}

function detenerSimulacion() {
  moviendo = false;
  document.getElementById("resultado").innerHTML = `
    Resultados:<br>
    Velocidad: ${velocidad.toFixed(2)} km/h<br>
    Tiempo: ${tiempoTotal.toFixed(2)} horas<br>
    Distancia: ${distanciaTotal.toFixed(2)} km
  `;
  preDibujarSimulacion();
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

function dibujarRecta() {
  ctx.strokeStyle = "lightgreen";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

function preDibujarSimulacion() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  x = 20;
  y = canvas.height / 2;
  dibujarAuto(x, y, "pink");
  dibujarRecta();
}

preDibujarSimulacion();