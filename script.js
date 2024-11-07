const canvas = document.getElementById('simulacionCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Variables iniciales
let x = canvas.width / 2;
let y = canvas.height / 2;
let velocidad = 0;
let aceleracion = 1;
let carga = 'electron';
let campoDireccion = 'derecha';
let campoCarga = 'positiva';
let tiempo = 0;
let moviendo = false;

function preDibujarSimulacion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    x = canvas.width / 2;
    y = canvas.height / 2;

    // Dibujar la partícula en la posición inicial
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = carga === 'electron' ? 'red' : 'blue';
    ctx.fill();

    // Dibujar líneas de campo eléctrico con flechas
    dibujarCampoElectrico(campoDireccion, campoCarga);
}

function iniciarSimulacion() {
    velocidad = parseFloat(document.getElementById('velocidad').value);
    aceleracion = parseFloat(document.getElementById('aceleracion').value);
    carga = document.getElementById('carga').value;
    campoDireccion = document.getElementById('direccion-campo').value;
    campoCarga = document.getElementById('carga-campo').value;

    tiempo = 0;
    moviendo = true;
    document.getElementById('resultado').innerHTML = ''; // Limpiar resultado anterior
    requestAnimationFrame(actualizarSimulacion);
}

function pausarSimulacion() {
    moviendo = false;
}

function actualizarSimulacion() {
    if (moviendo) {
        tiempo += 0.1; // Incrementar tiempo en intervalos pequeños
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calcular nueva posición aplicando MRUA: posición = posición_inicial + velocidad_inicial * tiempo + 0.5 * aceleración * tiempo^2
        let desplazamiento = velocidad * tiempo + 0.5 * aceleracion * Math.pow(tiempo, 2);
        let fuerzaCampo = (campoCarga === 'positiva' ? 1 : -1) * (carga === 'proton' ? -1 : 1);

        // Actualizar posición según la dirección del campo
        if (campoDireccion === 'derecha') {
            x += desplazamiento * fuerzaCampo;
        } else if (campoDireccion === 'izquierda') {
            x -= desplazamiento * fuerzaCampo;
        } else if (campoDireccion === 'arriba') {
            y -= desplazamiento * fuerzaCampo;
        } else if (campoDireccion === 'abajo') {
            y += desplazamiento * fuerzaCampo;
        }

        // Dibujar la partícula
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = carga === 'electron' ? 'red' : 'blue';
        ctx.fill();

        // Dibujar líneas de campo eléctrico con flechas
        dibujarCampoElectrico(campoDireccion, campoCarga);

        // Verificar límites
        if (x > canvas.width - 20 || x < 20 || y > canvas.height - 20 || y < 20) {
            moviendo = false;
            document.getElementById('resultado').innerHTML = `Simulación terminada. La partícula recorrió una distancia de ${Math.abs(desplazamiento).toFixed(2)} px en ${(tiempo).toFixed(2)} s.`;
            preDibujarSimulacion(); // Reiniciar la simulación en la posición central
        } else {
            requestAnimationFrame(actualizarSimulacion);
        }
    }
}

function dibujarCampoElectrico(direccion, cargaCampo) {
    ctx.strokeStyle = cargaCampo === 'positiva' ? 'lightgreen' : 'red';
    ctx.lineWidth = 2;

    // Dibujar líneas y flechas en la dirección del campo
    const lineSpacing = 40;
    const arrowSpacing = 80;

    if (direccion === 'derecha' || direccion === 'izquierda') {
        for (let i = 0; i < canvas.height; i += lineSpacing) {
            for (let j = 0; j < canvas.width; j += arrowSpacing) {
                ctx.beginPath();
                ctx.moveTo(j, i);
                ctx.lineTo(j + (direccion === 'derecha' ? 60 : -60), i);
                ctx.stroke();
                dibujarFlecha(j + (direccion === 'derecha' ? 50 : -50), i, direccion);
            }
        }
    } else {
        for (let i = 0; i < canvas.width; i += lineSpacing) {
            for (let j = 0; j < canvas.height; j += arrowSpacing) {
                ctx.beginPath();
                ctx.moveTo(i, j);
                ctx.lineTo(i, j + (direccion === 'abajo' ? 60 : -60));
                ctx.stroke();
                dibujarFlecha(i, j + (direccion === 'abajo' ? 50 : -50), direccion);
            }
        }
    }
}

function dibujarFlecha(x, y, direccion) {
    ctx.beginPath();
    if (direccion === 'derecha') {
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x + 10, y);
        ctx.lineTo(x, y + 5);
    } else if (direccion === 'izquierda') {
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x - 10, y);
        ctx.lineTo(x, y + 5);
    } else if (direccion === 'abajo') {
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x, y + 10);
        ctx.lineTo(x + 5, y);
    } else if (direccion === 'arriba') {
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x, y - 10);
        ctx.lineTo(x + 5, y);
    }
    ctx.fill();
}

// Predibujar la simulación al cargar la página
preDibujarSimulacion();
