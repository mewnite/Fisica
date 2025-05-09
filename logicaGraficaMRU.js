document.addEventListener("DOMContentLoaded", () => {
    let distancia;
    let datosAuto = [];
    let velocidad;
    let tiempo;

    document.addEventListener("click", (event) => {
        if (event.target && event.target.id === "btnGrafica") {
            datosAuto = [];
            document.querySelectorAll("input").forEach((input) => {
                datosAuto.push(input.value);
            });
            let isKm = document.getElementById("medida").value;
            let isHs = document.getElementById("tmp").value;
            datosAuto.push(`${isKm}/${isHs}`);
            velocidad = parseFloat(datosAuto[0]);
            tiempo = parseFloat(datosAuto[1]);
            let unidadVelocidad = isKm; // Unidad de velocidad
            let unidadTiempo = isHs; // Unidad de tiempo
            distancia = velocidad * tiempo;

            // Generar datos para la gráfica
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
                            maintainAspectRatio: false,
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
