const palabras = [
    { palabra: "CORRIENTE", pista: "movimiento de electrones en un circuitos." },
    { palabra: "TIEMPO", pista: "siempre aumenta." },
    { palabra: "PILA", pista: "fuente pequeña de energia electrica." },
    { palabra: "DISTANCIA", pista: "longitud del trayecto recorrido." },
    { palabra: "CARGA", pista: "propiedad electronica de los cuerpos." },
    { palabra: "RESISTENCIA", pista: "dificulta el paso de la corriente." },
    { palabra: "SONIDO", pista: "onda que se puede escuchar." },
    { palabra: "LUZ", pista: "onda electromagnetica que podemos ver." },
    { palabra: "VELOCIDAD", pista: "cuando cambia la posicion por segundo." },
    { palabra: "DENSIDAD", pista: "rotacion entre masa y volumen." }
  ];

const gridSize = 12;
const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
const soluciones = [];
const pistas = [];

function buscarCruce(palabra) {
    for (let fila = 0; fila < gridSize; fila++) {
        for (let col = 0; col < gridSize; col++) {
            for (let i = 0; i < palabra.length; i++) {
                // Intentar colocar horizontal
                if (col - i >= 0 && col - i + palabra.length <= gridSize && puedeColocarHorizontal(palabra, fila, col - i, i)) {
                    return { fila, col: col - i, horizontal: true };
                }
                // Intentar colocar vertical
                if (fila - i >= 0 && fila - i + palabra.length <= gridSize && puedeColocarVertical(palabra, fila - i, col, i)) {
                    return { fila: fila - i, col, horizontal: false };
                }
            }
        }
    }
    return null;
}

function puedeColocarHorizontal(palabra, fila, col, offset = 0) {
    for (let i = 0; i < palabra.length; i++) {
        const celda = grid[fila][col + i];
        if (celda !== "" && celda !== palabra[i]) return false;
        if (celda === palabra[i] && i !== offset) return true; // Permite cruzar
    }
    return true;
}

function puedeColocarVertical(palabra, fila, col, offset = 0) {
    for (let i = 0; i < palabra.length; i++) {
        const celda = grid[fila + i][col];
        if (celda !== "" && celda !== palabra[i]) return false;
        if (celda === palabra[i] && i !== offset) return true; // Permite cruzar
    }
    return true;
}

function colocarHorizontal(palabra, fila, col) {
    for (let i = 0; i < palabra.length; i++) {
        grid[fila][col + i] = palabra[i];
    }
    soluciones.push({ palabra, fila, col, horizontal: true });
}

function colocarVertical(palabra, fila, col) {
    for (let i = 0; i < palabra.length; i++) {
        grid[fila + i][col] = palabra[i];
    }
    soluciones.push({ palabra, fila, col, horizontal: false });
}

function colocarPalabras() {
    const seleccionadas = [...palabras].sort((a, b) => b.palabra.length - a.palabra.length); // Ordenar por longitud

    seleccionadas.forEach(p => {
        const posicion = buscarCruce(p.palabra);
        if (posicion) {
            if (posicion.horizontal) {
                colocarHorizontal(p.palabra, posicion.fila, posicion.col);
            } else {
                colocarVertical(p.palabra, posicion.fila, posicion.col);
            }
            pistas.push(p.pista);
        }
    });
}

colocarPalabras();
const numeradas = new Map();
let numeroActual = 1;

soluciones.forEach(sol => {
    const key = `${sol.fila}-${sol.col}`;
    if (!numeradas.has(key)) {
        numeradas.set(key, numeroActual++);
    }
});

const crucigrama = document.getElementById("crucigrama");
crucigrama.innerHTML = "";
crucigrama.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;

for (let fila = 0; fila < gridSize; fila++) {
    for (let col = 0; col < gridSize; col++) {
        const celdaDiv = document.createElement("div");
        celdaDiv.classList.add("celda");

        const input = document.createElement("input");
        input.maxLength = 1;

        if (grid[fila][col] === "") {
            input.disabled = true;
        } else {
            input.dataset.row = fila;
            input.dataset.col = col;

            const key = `${fila}-${col}`;
            if (numeradas.has(key)) {
                const numero = document.createElement("div");
                numero.className = "numero";
                numero.textContent = numeradas.get(key);
                celdaDiv.appendChild(numero);
            }
        }

        celdaDiv.appendChild(input);
        crucigrama.appendChild(celdaDiv);
    }
}

const listaPistas = document.getElementById("lista-pistas");
listaPistas.innerHTML = soluciones.map((sol, i) => {
    const num = numeradas.get(`${sol.fila}-${sol.col}`);
    return `<li><strong>${num}. ${sol.horizontal ? 'Horizontal' : 'Vertical'}:</strong> ${pistas[i]}</li>`;
}).join("");

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
        ? "¡Todo correcto! "
        : "Hay errores. Revisa las letras en rojo.";
}

document.addEventListener("input", e => {
    if (e.target.tagName === "INPUT") {
        e.target.style.backgroundColor = "";
        document.getElementById("resultado").textContent = "";
    }
});
