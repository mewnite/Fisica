// Array para almacenar las posiciones de los elementos arrastrados.
const posiciones = [];

// Contadores para los electrones y protones clonados.
let iterationsE = 0;
let iterationsP = 0;

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

//prepara a el elemento para ser arrastrado con un pequeño delay
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
          carga = "-1,6x10^-19 C"; // Carga del electrón
      } else if (clonedElement.classList.contains("proton")) {
          carga = "+1,6x10^-19 C"; // Carga del protón
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

// Función para obtener los valores de los inputs.
function getValue() {
  return inputsCreados.map((input) => input.value);
}

// Función para calcular la distancia entre elementos id1 e id2 (hay que hacerlo escalable para varios objetos).
function calcularDistancia(id1, id2) {
  // Encontrar las posiciones de los elementos en el array posiciones.
  const elemento1 = posiciones.find((pos) => pos.id === id1);
  const elemento2 = posiciones.find((pos) => pos.id === id2);

  if (!elemento1 || !elemento2) {
    console.error("No se encontraron las posiciones de uno o ambos elementos.");
    return 0;
  }

  // Calcular la distancia usando la fórmula de distancia euclidiana.
  const distancia = Math.sqrt(
    Math.pow(elemento2.left - elemento1.left, 2) +
      Math.pow(elemento2.top - elemento1.top, 2)
  );

  // Convertir la distancia a cm y asegurar que solo haya 2 decimales.
  let cm = (distancia * 0.026458).toFixed(2);

  // Convertir los cm a metros.
  let m = (cm / 100).toFixed(2);

  return m;
}

// Botón para enviar los datos y calcular la distancia.
document.getElementById("enviarID").addEventListener("click", (event) => {
  event.preventDefault();
  html2canvas(document.body).then(function(canvas) {
    // Convertir el canvas a una imagen en formato base64
    var imgData = canvas.toDataURL('image/png');
    
    // Mostrar la imagen en un SweetAlert2
    Swal.fire({
        title: 'Captura de Pantalla',
        text: 'Aquí está tu captura de pantalla:',
        imageUrl: imgData, // Usamos la imagen generada por html2canvas
        imageAlt: 'Captura de pantalla',
        confirmButtonText: 'Cerrar'
    });
}).catch(function(error) {
    console.error('Error al capturar la pantalla:', error);
});
  // Llamar a la función getValue y obtener los valores.
  const ids = getValue();

  // Calcular la distancia entre los dos elementos con las IDs obtenidas.
  const distancia = calcularDistancia(ids[0], ids[1]);

  alert(`La distancia entre ${ids[0]} y ${ids[1]} es: ${distancia} m`);
  let campo = 9.0e9 * 1.6e10 - 19;
  let resultado = campo / m;
  console.log(resultado);
});


let menu = document.getElementById("Menu");
let sub = document.getElementById("sub");

function animateMenu() {
    menu.removeEventListener("mouseover", animateMenu); // Eliminamos el evento para evitar múltiples animaciones.
  
    // Animación para el submenú.
    sub.animate([{ bottom: "0px" }, { bottom: "50px" }], {
      duration: 2000,
      easing: "ease",
      fill: "forwards",
    });
  
    // Animación para el menú principal.
    menu.animate([{ bottom: "20px" }, { bottom: "100px" }], {
      duration: 2000,
      easing: "ease",
      fill: "forwards",
    });
  
    //Restauramos el evento de 'mouseover' después de la animación.
    setTimeout(() => {
      menu.addEventListener("mouseover", animateMenu);
    }, 2000);
  }
  
  // Añadimos el evento 'mouseover' al menú para iniciar la animación.
  menu.addEventListener("mouseover", animateMenu);

