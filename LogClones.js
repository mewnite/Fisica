// Array para almacenar las posiciones de los elementos arrastrados.
const posiciones = [];

// Contadores para los electrones y protones clonados.
let iterationsE = 0;
let iterationsP = 0;
const cargaElectron = 1.6e-19; // Carga de un electrón
const cargaProton = 1.6e-19; // Carga de un protón
// Array para almacenar los inputs creados.
let inputsCreados = [];

// Obtener el contenedor donde aparecerán los inputs
const contenedorInputs = document.getElementById("contenedorInputs");

// Función principal que habilita el arrastre y clonado de un elemento.
function enableDragAndClone(element) {
  element.addEventListener("mousedown", (event) => {
    let targetElement = element;

    // Si el elemento tiene la clase 'original', lo clonamos.
    if (element.classList.contains("original")) {
      targetElement = cloneElement(element); // Clonamos el elemento.
      document.body.appendChild(targetElement); // Añadimos el clon al documento.
      enableDrag(targetElement); // Habilitamos el arrastre para el clon.
    }

    // Preparamos el elemento para el arrastre.
    prepareElementForDragging(targetElement);

    // Iniciamos el arrastre del elemento.
    startDragging(targetElement, event);
  });

  // Desactivar el comportamiento de arrastre por defecto.
  element.ondragstart = () => false;
}

function enableDrag(element) {
  element.addEventListener("mousedown", (event) => {
    prepareElementForDragging(element); // Preparamos el elemento.
    startDragging(element, event); // Iniciamos el arrastre.
  });
}

// Prepara el elemento para ser arrastrado con un pequeño delay
function prepareElementForDragging(element) {
  element.style.position = "absolute";
  element.style.zIndex = 1000;
  document.body.append(element);
}

// Función para clonar el elemento original.
function cloneElement(element) {
  const clonedElement = element.cloneNode(true); // Clonamos el nodo completo.
  clonedElement.classList.remove("original"); // Eliminamos la clase 'original' del clon.
  clonedElement.classList.add("p"); // Añadimos una nueva clase para el clon.
  clonedElement.style.position = "absolute"; // Posicionamos el clon de forma absoluta.
  clonedElement.style.zIndex = 1000; // Aseguramos que el clon esté en el frente.

  // Asignamos un ID único para cada clon de electrón o protón.
  if (element.id === "electronO") {
    clonedElement.id = `eq${iterationsE++}`; // Incrementamos el contador de electrones.
  } else if (element.id === "protonO") {
    clonedElement.id = `pq${iterationsP++}`; // Incrementamos el contador de protones.
  }

  const tooltip = document.getElementById("tooltip");

  clonedElement.addEventListener("mouseover", () => {
    const id = clonedElement.id;
    let carga;
    if (clonedElement.classList.contains("electron")) {
      carga = "1.6e-19"; // Carga del electrón
    } else if (clonedElement.classList.contains("proton")) {
      carga = "+1.6x10^-19 C"; // Carga del protón
    }

    tooltip.innerHTML = `ID: ${id}, Carga: ${carga}`;
    tooltip.style.display = "block";
  });

  clonedElement.addEventListener("mouseout", () => {
    tooltip.style.display = "none";
  });
  
  // Manejamos el clic en el clon.
  handleDragAndClick(clonedElement);

  // Añadimos un nuevo input para el clon creado.
  addOrUpdateInput(clonedElement.id);

  return clonedElement; // Retornamos el clon.
}

// Función para manejar el arrastre y clic del elemento.
function handleDragAndClick(element) {
  let isDragging = false; // Variable para rastrear si estamos arrastrando.
  let startX, startY, initialX, initialY;

  // Cuando hacemos clic (mousedown), comenzamos a rastrear la posición.
  element.addEventListener("mousedown", (event) => {
    isDragging = false; // Inicialmente no estamos arrastrando.
    startX = event.clientX;
    startY = event.clientY;
    initialX = element.offsetLeft;
    initialY = element.offsetTop;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(event) {
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      isDragging = true; // Si el movimiento es significativo, estamos arrastrando.
    }

    if (isDragging) {
      element.style.left = `${initialX + dx}px`;
      element.style.top = `${initialY + dy}px`;
    }
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    if (!isDragging) {
      addOrUpdateInput(element.id); // Añadimos o actualizamos el input con el ID.
    } else {
      updateElementPosition(element); // Actualizamos la posición en el array de posiciones.
    }
  }
}

// Función para añadir o actualizar los inputs.
function addOrUpdateInput(id) {
  // Solo creamos hasta un máximo de 5 inputs.
  if (inputsCreados.length < 5) {
    // Creamos un nuevo input si no se han creado suficientes.
    const input = document.createElement("input");
    input.type = "text";
    input.value = id;
    inputsCreados.push(input);
    contenedorInputs.appendChild(input); // Añadimos el input al contenedor inferior.
  }
}

// Función para actualizar la posición del elemento en el array 'posiciones'.
function updateElementPosition(element) {
  const { left, top } = element.getBoundingClientRect(); // Obtenemos las nuevas coordenadas del elemento.
  const { id } = element;

  // Buscamos si el elemento ya está en el array 'posiciones' por su ID.
  const index = posiciones.findIndex((pos) => pos.id === id);
  if (index !== -1) {
    posiciones[index] = { id, left, top };
  } else {
    posiciones.push({ id, left, top });
  }

  // Debug: Mostrar las posiciones en consola.
  for (let i = 0; i < posiciones.length; i++) {
    console.log(posiciones[i]);
  }
}

// Función para iniciar el arrastre del elemento
function startDragging(targetElement, event) {
  function moveAt(pageX, pageY) {
    targetElement.style.left = pageX - targetElement.offsetWidth / 2 + "px";
    targetElement.style.top = pageY - targetElement.offsetHeight / 2 + "px";
  }

  moveAt(event.pageX, event.pageY);

  const onMouseMove = (event) => moveAt(event.pageX, event.pageY);

  document.addEventListener("mousemove", onMouseMove);

  targetElement.onmouseup = () => {
    updateElementPosition(targetElement);
    document.removeEventListener("mousemove", onMouseMove);
    targetElement.onmouseup = null;
  };
}

function getValue() {
  return inputsCreados.map((input) => input.value);
}

// Habilitamos el arrastre y clonado de los elementos originales.
const electron = document.getElementById("electronO");
const proton = document.getElementById("protonO");
const alfa = document.getElementById("alfaO");

electron.classList.add("original");
proton.classList.add("original");
alfa.classList.add("original");

enableDragAndClone(electron);
enableDragAndClone(proton);
enableDragAndClone(alfa);

const K_E = 9e9; // Constante de Coulomb


// Constante para convertir píxeles a centímetros
const PIXEL_A_CM = 0.026458;

// Función para calcular la distancia entre dos cargas
function calcularDistancia(carga1, carga2) {
    const dx = (carga1.posicion.x - carga2.posicion.x) * PIXEL_A_CM;
    const dy = (carga1.posicion.y - carga2.posicion.y) * PIXEL_A_CM;
    return Math.sqrt(dx * dx + dy * dy);
}

// Función para calcular la fuerza entre múltiples cargas
function calcularFuerzas(cargas) {
    const fuerzas = [];

    for (let i = 0; i < cargas.length; i++) {
        for (let j = i + 1; j < cargas.length; j++) {
            const carga1 = cargas[i];
            const carga2 = cargas[j];
            const distancia = calcularDistancia(carga1, carga2);
            console.log(`Distancia entre carga ${i} y carga ${j}: ${distancia} cm`); // Log de distancia

            // Verificar que la distancia no sea cero
            if (distancia === 0) {
                console.error("Las cargas están en la misma posición. No se puede calcular la fuerza.");
                continue;
            }

            const fuerza = (K_E * Math.abs(carga1.carga * carga2.carga)) / Math.pow(distancia, 2);
            
            const tipoInteraccion = (carga1.carga - carga2.carga == 0) ? "Repulsión" : "Atracción";
            console.log("carga elemento1: " + carga1.carga);
            console.log("carga elemento2: " + carga2.carga);
            // Guardar los resultados
            fuerzas.push({
                carga1: carga1,
                carga2: carga2,
                distancia: distancia,
                fuerza: fuerza,
                tipo: tipoInteraccion
            });

            Swal.fire({
                title: "Resultado",
                text: `Fuerza entre carga ${i} y carga ${j}: ${fuerza} N (${tipoInteraccion})`,
                icon: "success"
            }); // Log de fuerza
        }
    }

    return fuerzas;
}


document.getElementById("enviarID").addEventListener("click", (event) => {
  // Array de cargas (carga en Coulombs) y posiciones (x, y)
  var car1 = 1; 
  var car2 = -1; 
if(posiciones[1].id ==  "pq1"){
  car1 = 1;
  car2 = 1 
}else if(posiciones[1].id == "eq1"){
  car2 = car1 * 1
}else{
 car1 =  1.6e19
 car2 = -1.6e19
}

console.log("resultados finales: " + (car1 + car2))
console.log(posiciones[1].id)
const cargas = [
  { carga: car1, posicion: {x: posiciones[0].left, y: posiciones[0].top } }, // eq0
  { carga: car2, posicion: { x: posiciones[1].left, y: posiciones[1].top } }, // pq0
  // Puedes agregar más cargas aquí
];


  event.preventDefault();
  const ids = getValue();
  console.log(ids[0])

  // Calcular la fuerza entre los elementos con las IDs obtenidas.
  if (ids.length < 2) {
    alert("Por favor, selecciona al menos dos partículas.");
    return;
  }

  calcularFuerzas(cargas)

});