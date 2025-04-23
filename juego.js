const palabras = [
  { palabra: "CORRIENTE", pista: "Movimiento de electrones en un circuito." },
  { palabra: "TIEMPO", pista: "Siempre aumenta." },
  { palabra: "PILA", pista: "Fuente pequeña de energía eléctrica." },
  { palabra: "DISTANCIA", pista: "Longitud del trayecto recorrido." },
  { palabra: "CARGA", pista: "Propiedad electrónica de los cuerpos." },
  { palabra: "RESISTENCIA", pista: "Dificulta el paso de la corriente." },
  { palabra: "SONIDO", pista: "Onda que se puede escuchar." },
  { palabra: "LUZ", pista: "Onda electromagnética que podemos ver." },
  { palabra: "VELOCIDAD", pista: "Cuando cambia la posición por segundo." },
];

const gridSize = 12;
const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
const numeradas = new Map();
let numeroActual = 1;

// Colocación fija de palabras
const posiciones = [
  { palabra: "CORRIENTE", fila: 0, col: 0, horizontal: true },
  { palabra: "TIEMPO", fila: 2, col: 0, horizontal: true },
  { palabra: "PILA", fila: 4, col: 0, horizontal: true },
  { palabra: "DISTANCIA", fila: 6, col: 0, horizontal: true },
  { palabra: "CARGA", fila: 8, col: 0, horizontal: true },
  { palabra: "RESISTENCIA", fila: 10, col: 0, horizontal: true },
  { palabra: "SONIDO", fila: 3, col: 2, horizontal: false },
  { palabra: "LUZ", fila: 5, col: 4, horizontal: false },
  { palabra: "VELOCIDAD", fila: 1, col: 6, horizontal: false },
];

// Agregar las palabras al grid y numerar sus posiciones iniciales
posiciones.forEach(({ palabra, fila, col, horizontal }, index) => {
  if (horizontal && col + palabra.length > gridSize) {
    console.error(`La palabra "${palabra}" no cabe horizontalmente en la fila ${fila}.`);
  } else if (!horizontal && fila + palabra.length > gridSize) {
    console.error(`La palabra "${palabra}" no cabe verticalmente en la columna ${col}.`);
  } else {
    for (let i = 0; i < palabra.length; i++) {
      if (horizontal) {
        grid[fila][col + i] = palabra[i];
      } else {
        grid[fila + i][col] = palabra[i];
      }
    }
    // Numerar la celda inicial de la palabra
    numeradas.set(`${fila}-${col}`, numeroActual++);
  }
});

// Generación del crucigrama
const crucigrama = document.getElementById("crucigrama");
crucigrama.innerHTML = "";
crucigrama.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;

// Renderiza el tablero
for (let fila = 0; fila < gridSize; fila++) {
  for (let col = 0; col < gridSize; col++) {
    const celdaDiv = document.createElement("div");
    celdaDiv.classList.add("celda");

    const input = document.createElement("input");
    input.maxLength = 1;

    const key = `${fila}-${col}`;
    if (numeradas.has(key)) {
      const numero = document.createElement("div");
      numero.className = "numero";
      numero.textContent = numeradas.get(key);
      celdaDiv.appendChild(numero);
    }

    if (grid[fila][col] === "") {
      input.disabled = true;
    } else {
      input.dataset.row = fila;
      input.dataset.col = col;
    }

    celdaDiv.appendChild(input);
    crucigrama.appendChild(celdaDiv);
  }
}

// Renderiza las pistas
const listaPistas = document.getElementById("lista-pistas");
listaPistas.innerHTML = posiciones
  .map((pos, i) => `<li><strong>${i + 1}. ${pos.horizontal ? "Horizontal" : "Vertical"}:</strong> ${palabras[i].pista}</li>`)
  .join("");

// Función para verificar las respuestas
function verificar() {
  let correcto = true;
  const inputs = document.querySelectorAll("#crucigrama input");

  inputs.forEach(input => {
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    const valor = input.value.toUpperCase();

    if (grid[row][col] !== "" && valor !== grid[row][col]) {
      input.style.backgroundColor = "#f88";
      correcto = false;
    } else if (!input.disabled) {
      input.style.backgroundColor = "#8f8";
    }
  });

  const resultado = document.getElementById("resultado");
  resultado.textContent = correcto
    ? "¡Todo correcto! 🎉"
    : "Hay errores. Revisa las letras en rojo.";
}

document.addEventListener("input", e => {
  if (e.target.tagName === "INPUT") {
    e.target.style.backgroundColor = "";
    document.getElementById("resultado").textContent = "";
  }
});
