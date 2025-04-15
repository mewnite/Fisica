document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (event) => {
        if (event.target && event.target.id === "btnGrafica") {
            const velocidad = parseFloat(document.getElementById("velocidad").value) || 0;
            const tiempo = parseFloat(document.getElementById("tiempo").value) || 0;
            const unidadVelocidad = document.getElementById("medida").value;
            const unidadTiempo = document.getElementById("tmp").value; 

            if (tiempo <= 0 || velocidad <= 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, ingresa valores válidos para la velocidad y el tiempo.',
                });
                return;
            }

            // Conversión de unidades
            let velocidadConvertida = velocidad;
            let tiempoConvertido = tiempo;

            if (unidadVelocidad === "m" && unidadTiempo === "horas") {
                velocidadConvertida = velocidad / 3.6; 
            } else if (unidadVelocidad === "km" && unidadTiempo === "s") {
                tiempoConvertido = tiempo / 3600; 
            } else if (unidadVelocidad === "km" && unidadTiempo === "minutos") {
                tiempoConvertido = tiempo / 60; 
            }

            // Datos para la gráfica
            const labels = [];
            const data = [];
            const tiempoPaso = tiempo / 5;

            for (let i = 0; i <= 5; i++) {
                const tiempoActual = tiempoPaso * i; 
                labels.push(`${tiempoActual.toFixed(2)} ${unidadTiempo}`);
                const distancia = velocidad * tiempoActual / tiempo;
                data.push(distancia.toFixed(2));
            }

            // Mostrar la gráfica
            Swal.fire({
                title: 'Gráfica Velocidad / Tiempo',
                html: '<canvas id="graficaVelocidadTiempo" width="400" height="200"></canvas>',
                showConfirmButton: true,
                didOpen: () => {
                    const ctx = document.getElementById('graficaVelocidadTiempo').getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: `Distancia (${unidadVelocidad})`,
                                data: data,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderWidth: 2,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top'
                                }
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: `Tiempo (${unidadTiempo})`
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: `Distancia (${unidadVelocidad})`
                                    },
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
            });
        }
    });
});
