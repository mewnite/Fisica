const canvas = document.getElementById("simulacionCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

function CalcularSinCanva(vel, temp) {
  return vel / temp;
}

function getTime() {
  let tiempo = document.getElementById("tiempo").value;
  return tiempo;
}

window.onload = function () {
    localStorage.removeItem("contadorAutos");
    localStorage.removeItem("auto1");
    localStorage.removeItem("auto2");
    document.getElementById("iniciar").hidden = true; 
    document.getElementById("iniciar").addEventListener("click", iniciarSimulacion);
}

function borrar(){
    Swal.fire({
        icon: "success",
        title: `Logro`,
        text: `Se han borrado los datos de la simulación`,
        confirmButtonText: "Aceptar",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-lg font-bold text-gray-700",
          confirmButton:
            "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
        },
      });
    localStorage.removeItem("contadorAutos");
    localStorage.removeItem("auto1");
    localStorage.removeItem("auto2");
    document.getElementById("iniciar").hidden = true; 
    document.getElementById("iniciar").addEventListener("click", iniciarSimulacion);
}

function getVel() {
  let velocidad = document.getElementById("velocidad").value;
  return velocidad;
}

function veriFicarTipo() {
  let MtoKm = document.getElementById("medida").value;
  let Hms = document.getElementById("tmp").value;
  let medidas;
  if (MtoKm == "km" && Hms == "horas") {
    medidas = true;
  } else if (MtoKm == "m" && Hms == "segundos") {
    medidas = true;
  } else {
    medidas = false;
  }
  return medidas;
}

function almacenarMedidas() {
  let MtoKm = document.getElementById("medida").value;
  let Hms = document.getElementById("tmp").value;
  let medidas;
  if (MtoKm == "km" && Hms == "horas") {
    medidas = "km/h";
  } else if (MtoKm == "m" && Hms == "segundos") {
    medidas = "m/s";
  }
  return medidas;
}

function calcular() {
  if (veriFicarTipo() === true) {
    let vel = getVel();
    let tiempo = getTime();
    resultado = CalcularSinCanva(vel, tiempo);
    resultado = `La distancia recorrida es: ${resultado} ${almacenarMedidas()}`;
  } else {
    resultado = "Error, verifica las unidades de medida seleccionadas";
  }
  return resultado;
}

// Variables iniciales
let x1 = canvas.width / 2;
let x2 = canvas.width / 2 + 100;
let y = canvas.height / 2;
let velocidad = 0;
let carga = "electron";
let campoDireccion = "derecha";
let tiempo = 0;
let moviendo = false;
let aceleracion = 0;

function preDibujarSimulacion() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  x1 = canvas.width / 2;
  x2 = canvas.width / 2 + 100;
  y = canvas.height / 2;

  const colorAuto1 = "pink";
  const colorAuto2 = "red";

  dibujarAuto(x1, y, colorAuto1);
  dibujarAuto(x2, y, colorAuto2);

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
  if(document.getElementById("velocidad").value === "0" || document.getElementById("tiempo").value === "0"){
    Swal.fire({
        icon: "error",
        title: `Error`,
        text: `No puedes tener valores 0`,
        confirmButtonText: "Aceptar",
        customClass: {
            popup: "rounded-xl shadow-lg",
            title: "text-lg font-bold text-gray-700",
            confirmButton:
                "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
        },
    });
    return
  }
  if(iteraciones ===2){
    Swal.fire({
        icon: "error",
        title: `Error`,
        text: `No se pueden enviar más datos`,
        confirmButtonText: "Aceptar",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-lg font-bold text-gray-700",
          confirmButton:
            "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
        },
      });
      return
  }
  let datosAuto = {};
  document.querySelectorAll("input").forEach((input) => {
    datosAuto[input.id] = input.value;
  });

  localStorage.setItem(`auto${iteraciones + 1}`, JSON.stringify(datosAuto));
  localStorage.setItem("contadorAutos", iteraciones + 1);
  document.getElementById("velocidad").value = "0";
  document.getElementById("tiempo").value = "0";
  actualizarValores();
}

async function actualizarValores() {
  let contador = parseInt(localStorage.getItem("contadorAutos")) || 0;
  Swal.fire({
    icon: "success",
    title: `Datos del auto ${contador} enviados`,
    text: `Se han enviado los datos del auto ${contador}`,
    confirmButtonText: "Aceptar",
    customClass: {
      popup: "rounded-xl shadow-lg",
      title: "text-lg font-bold text-gray-700",
      confirmButton:
        "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
    },
  });
  if(contador === 2) {
    document.getElementById("iniciar").hidden = false; 
  }
}

function cargarDatos() {
  let contador = parseInt(localStorage.getItem("contadorAutos")) || 0;

  for (let i = 1; i <= contador; i++) {
    console.log(`Auto${i}:`, JSON.parse(localStorage.getItem(`auto${i}`)));
  }
}

function iniciarSimulacion() {
  let auto1 = JSON.parse(localStorage.getItem("auto1")); // Obtener datos del primer auto desde localStorage
  let auto2 = JSON.parse(localStorage.getItem("auto2")); // Obtener datos del segundo auto desde localStorage

  let velocidadAuto1 = auto1 ? parseFloat(auto1.velocidad) : null; // Extraer la velocidad del primer auto
  let velocidadAuto2 = auto2 ? parseFloat(auto2.velocidad) : null; // Extraer la velocidad del segundo auto
  let tiempoO = parseFloat(document.getElementById("tiempo").value);
  campoDireccion = document.getElementById("direccion-campo").value;

  if (!auto1 || isNaN(velocidadAuto1) || velocidadAuto1 < 0) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "La velocidad del Auto 1 no puede ser negativa, inválida o no estar configurada.",
      confirmButtonText: "Aceptar",
      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-lg font-bold text-gray-700",
        confirmButton:
          "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
      },
    });
    return;
  }

  if (!auto2 || isNaN(velocidadAuto2) || velocidadAuto2 < 0) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "La velocidad del Auto 2 no puede ser negativa, inválida o no estar configurada.",
      confirmButtonText: "Aceptar",
      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-lg font-bold text-gray-700",
        confirmButton:
          "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
      },
    });
    return;
  }

  if (isNaN(tiempoO) || tiempoO < 0) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "El tiempo no puede ser negativo o inválido.",
      confirmButtonText: "Aceptar",
      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-lg font-bold text-gray-700",
        confirmButton:
          "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md",
      },
    });
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

    let desplazamientoAuto1 =
      velocidad.auto1 * tiempo + 0.5 * aceleracion * Math.pow(tiempo, 2);
    let desplazamientoAuto2 =
      velocidad.auto2 * tiempo + 0.5 * aceleracion * Math.pow(tiempo, 2);

    if (campoDireccion === "derecha") {
      x1 += desplazamientoAuto1;
      x2 += desplazamientoAuto2;
    } else if (campoDireccion === "izquierda") {
      x1 -= desplazamientoAuto1;
      x2 -= desplazamientoAuto2;
    }

    dibujarAuto(x1, y, "pink");
    dibujarAuto(x2, y, "red");
    dibujarRecta(campoDireccion);

    let auto1Llegado = false;
    let auto2Llegado = false;

    if (campoDireccion === "derecha") {
      auto1Llegado = x1 > canvas.width - 20;
      auto2Llegado = x2 > canvas.width - 20;
    } else if (campoDireccion === "izquierda") {
      auto1Llegado = x1 < 20;
      auto2Llegado = x2 < 20;
    }

    if (auto1Llegado && auto2Llegado) {
      detenerSimulacion();
    } else {
      requestAnimationFrame(actualizarSimulacion);
    }
  }
}

function detenerSimulacion() {
  moviendo = false;
  document.getElementById("resultado").innerHTML = calcular();

  if (!document.getElementById("btnGrafica")) {
    let mostrar = document
      .getElementById("contenedor")
      .appendChild(document.createElement("button"));
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
  } else if (direccion === "izquierda") {
    ctx.moveTo(canvas.width, canvas.height / 2);
    ctx.lineTo(0, canvas.height / 2);
  }

  ctx.stroke();
}

preDibujarSimulacion();
