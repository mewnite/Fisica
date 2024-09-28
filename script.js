// Array para almacenar las posiciones de los elementos arrastrados
const posiciones = [];
let iterationsE = 0; // Contador para los electrones clonados
let iterationsP = 0; // Contador para los protones clonados

// Función para habilitar el arrastre y clonado de un elemento
function enableDragAndClone(element) {
    element.addEventListener("mousedown", (event) => {
        let targetElement = element;

        // Clonar el elemento si tiene la clase 'original'
        if (element.classList.contains("original")) {
            targetElement = cloneElement(element);
            document.body.appendChild(targetElement);
            enableDrag(targetElement);
        }

        prepareElementForDragging(targetElement);
        startDragging(targetElement, event);
    });

    element.ondragstart = () => false; // Desactivar el comportamiento de arrastre por defecto

   
}

// Función para clonar el elemento original
function cloneElement(element) {
    const clonedElement = element.cloneNode(true);
    clonedElement.classList.remove("original");
    clonedElement.classList.add("p");
    clonedElement.style.position = "absolute";
    clonedElement.style.zIndex = 1000;

    if (element.id === "electronO") {
        clonedElement.id = `eq${iterationsE++}`;
    } else if (element.id === "protonO") {
        clonedElement.id = `pq${iterationsP++}`;
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

    return clonedElement;
}

// Función para preparar un elemento para el arrastre
function prepareElementForDragging(element) {
    element.style.position = "absolute";
    element.style.zIndex = 1000;
    document.body.append(element);
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

// Función para actualizar la posición de un elemento en el array
function updateElementPosition(element) {
    const { left, top } = element.getBoundingClientRect();
    const { id } = element;

    const index = posiciones.findIndex((pos) => pos.id === id);
    if (index !== -1) {
        posiciones[index] = {id,left,top};
    } else {
        posiciones.push({ id, left, top });
    }

    for(i = 0; i < posiciones.length; i++ ){
        console.log(posiciones[i])
        console.log(posiciones[i].left)
    }
}

// Función para habilitar el arrastre de un elemento ya clonado
function enableDrag(element) {
    element.addEventListener("mousedown", (event) => {
        prepareElementForDragging(element);
        startDragging(element, event);
    });

    element.ondragstart = () => false; // Desactivar el comportamiento de arrastre por defecto
}

// Obtener los elementos de electrón y protón originales
const electron = document.getElementById("electronO");
const proton = document.getElementById("protonO");
const alfa = document.getElementById("alfaO")
// Añadir la clase 'original' a los elementos originales
electron.classList.add("original");
proton.classList.add("original");
alfa.classList.add("original")

// Habilitar el arrastre y clonado para los elementos originales
enableDragAndClone(electron);
enableDragAndClone(proton);
enableDragAndClone(alfa)

let menu = document.getElementById("Menu");
let sub = document.getElementById("sub");

// Función para animar el menú cuando se pasa el mouse sobre él
function animateMenu() {
    menu.removeEventListener("mouseover", animateMenu);

    sub.animate(
        [{ bottom: "0px" }, { bottom: "50px" }],
        { duration: 2000, easing: "ease", fill: "forwards" }
    );

    menu.animate(
        [{ bottom: "20px" }, { bottom: "100px" }],
        { duration: 1900, easing: "ease" }
    );

    setTimeout(() => {
        menu.style.bottom = "100px";
    }, 1800);
}

// Añadir el evento de mouseover para iniciar la animación del menú
menu.addEventListener("mouseover", animateMenu);

// Función para obtener y retornar los valores de los inputs
function getValue() {
    // Referencias a los elementos de entrada
    const inputs = [document.getElementById("carga1"), document.getElementById("carga2")];
    
    // Retornar los valores actuales de los inputs como un array
    return inputs.map(input => input.value);
}

// Manejador de eventos para el botón 'Enviar IDs'
document.getElementById("enviarID").addEventListener("click", (event) => {
    event.preventDefault();
    
    // Llamar a la función getValue y obtener los valores
    const ids = getValue();
    
    // Calcular la distancia entre los dos elementos con las IDs obtenidas
    const distancia = calcularDistancia(ids[0], ids[1]);

    alert(`La distancia entre ${ids[0]} y ${ids[1]} es: ${distancia} m`)
    let campo = 9.0e9 * 1.6e10-19
    let resultado = campo / m
    console.log(resultado)
});


// Función para calcular la distancia entre dos elementos basándose en sus IDs
function calcularDistancia(id1, id2) {
    // Encontrar las posiciones de los elementos en el array `posiciones`
    const elemento1 = posiciones.find(pos => pos.id === id1);
    const elemento2 = posiciones.find(pos => pos.id === id2);

    if (!elemento1 || !elemento2) {
        console.error('No se encontraron las posiciones de uno o ambos elementos.');
        return 0;
    }

    // Calcular la distancia usando la fórmula de distancia euclidiana
    const distancia = Math.sqrt(
        Math.pow(elemento2.left - elemento1.left, 2) +
        Math.pow(elemento2.top - elemento1.top, 2)
    );

    // Convertir la distancia a cm y asegurar que solo haya 2 decimales
    let cm = (distancia * 0.026458).toFixed(2);

    // Convertir los cm a metros
    let m = (cm / 100).toFixed(2); 

    return m;
}
