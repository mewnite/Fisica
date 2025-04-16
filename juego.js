// Array de palabras aleatorias con sus pistas

const palabrasConPistas = [
    { palabra: "gato", pista: "Animal que dice 'miau'" },
    { palabra: "perro", pista: "Animal que dice 'guau'" },
    { palabra: "casa", pista: "Lugar donde vives" },
    { palabra: "sol", pista: "Estrella que ilumina el día" },
    { palabra: "luna", pista: "Objeto que ilumina la noche" },
    { palabra: "estrella", pista: "Objeto brillante en el cielo nocturno" }
];

// Función para obtener un número aleatorio entre un rango
function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para seleccionar palabras aleatorias
function seleccionarPalabrasAleatorias(palabras, cantidad) {
    const palabrasAleatorias = [];
    const indicesUsados = new Set();

    while (palabrasAleatorias.length < cantidad) {
        const indice = numeroAleatorio(0, palabras.length - 1);
        if (!indicesUsados.has(indice)) {
            indicesUsados.add(indice);
            palabrasAleatorias.push(palabras[indice]);
        }
    }

    return palabrasAleatorias;
}

// Función para generar un crucigrama básico
function generarCrucigrama(palabras) {
    const crucigrama = [];
    let fila = 0;

    palabras.forEach((palabra, index) => {
        if (index % 2 === 0) {
            for (let i = 0; i < palabra.length; i++) {
                if (!crucigrama[fila]) crucigrama[fila] = [];
                crucigrama[fila][i] = palabra[i];
            }
            fila++;
        } else {
            for (let i = 0; i < palabra.length; i++) {
                if (!crucigrama[i]) crucigrama[i] = [];
                crucigrama[i][0] = palabra[i];
            }
        }
    });

    return crucigrama;
}

// Función para imprimir el crucigrama
function imprimirCrucigrama(crucigrama) {
    crucigrama.forEach(fila => {
       fila.map(c => c || " ").join(" ");
    });
}

// Función para validar si una palabra está en el crucigrama
function validarPalabra(crucigrama, palabra) {
    const horizontal = crucigrama.some(fila => fila.join("").includes(palabra));
    const vertical = crucigrama[0].some((_, colIndex) => {
        const columna = crucigrama.map(fila => fila[colIndex] || "").join("");
        return columna.includes(palabra);
    });

    return horizontal || vertical;
}

// Generar y mostrar el crucigrama
const palabras = palabrasConPistas.map(obj => obj.palabra);
const crucigrama = generarCrucigrama(palabras);
imprimirCrucigrama(crucigrama);


document.addEventListener("DOMContentLoaded", () => {
    const caja = document.querySelector(".caja");

    const cantidadPalabras = numeroAleatorio(2, palabrasConPistas.length);
    const palabrasSeleccionadas = seleccionarPalabrasAleatorias(palabrasConPistas, cantidadPalabras);

    palabrasSeleccionadas.forEach(({ palabra, pista }) => {
        const contenedorPalabra = document.createElement("div");
        contenedorPalabra.classList.add("contenedor-palabra");

        const labelPista = document.createElement("p");
        labelPista.textContent = `Pista: ${pista}`;
        labelPista.classList.add("pista");
        contenedorPalabra.appendChild(labelPista);

        const inputs = [];
        palabra.split("").forEach(() => {
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.classList.add("letra-input");
            contenedorPalabra.appendChild(input);
            inputs.push(input);
        });

        const botonValidar = document.createElement("button");
        botonValidar.textContent = "Validar";
        botonValidar.classList.add("boton-validar");
        contenedorPalabra.appendChild(botonValidar);

        botonValidar.addEventListener("click", () => {
            let palabraIngresada = "";
            inputs.forEach(input => {
                palabraIngresada += input.value.toLowerCase();
            });

            if (palabraIngresada === palabra) {
                alert(`¡Correcto! La palabra era "${palabra}".`);
            } else {
                alert("Incorrecto. Intenta de nuevo.");
            }
        });

        caja.appendChild(contenedorPalabra);
    });
});
