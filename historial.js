import { obtenerAlquilerId } from "/src/Controllers/firebaseAlquiler";
import { getNombrePersonaById } from "/src/Controllers/firebaseSocio";

// Función para mostrar el historial de salidas del barco
async function mostrarHistorialSalidas(idDocumento) {
    const tablaHistorial = document.getElementById('tablaHistorialSalidas');
    const tbody = tablaHistorial.querySelector('tbody');

    if (tbody) {
        tbody.innerHTML = '';

        try {
            const alquileres = await obtenerAlquilerId();
            const salidas = alquileres.filter(salida => salida.data.barco === idDocumento);

            if (salidas.length > 0) {
                for (const salida of salidas) {
                    let fechaSalida = salida.data.fechaHoraSalida;
                    if (fechaSalida && fechaSalida.toDate) {
                        fechaSalida = fechaSalida.toDate();
                    } else {
                        fechaSalida = new Date(fechaSalida);
                    }
                    const fechaSalidaStr = fechaSalida.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
                    const nombrePersona = await getNombrePersonaById(salida.data.conductor);

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="p-5">${fechaSalidaStr}</td>
                        <td>${salida.data.destino}</td>
                        <td>${nombrePersona}</td>
                    `;
                    tbody.appendChild(row);
                }
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="3">No hay historial de salidas</td>`;
                tbody.appendChild(row);
            }
        } catch (error) {
            console.error("Error al obtener el historial de salidas: ", error);
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3">Error al obtener el historial de salidas</td>`;
            tbody.appendChild(row);
        }
    }
}

// Función para obtener el parámetro de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Llama a mostrarHistorialSalidas cuando la página se cargue
document.addEventListener("DOMContentLoaded", async() => {
    const idDocumento = getQueryParam('id');
    if (idDocumento) {
        await mostrarHistorialSalidas(idDocumento);
    } else {
        console.error("No se encontró el ID del documento en la URL");
    }
});