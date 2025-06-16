import fetch from 'node-fetch';

export default async function handler(req, res) {
    try {
        const apiUrl = 'https://ultimosismo.igp.gob.pe/api/ultimo-sismo';
        
        // Hacer la solicitud a la API del IGP
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error al obtener datos: ${response.statusText}`);

        const earthquakeData = await response.json();

        // Formatear la fecha (de "2025-06-15T17:25:18.000Z" a "15/06/2025")
        const dateObj = new Date(earthquakeData.fecha_hora);
        const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
        
        // Formatear la hora (de "2025-06-15T17:25:18.000Z" a "17:25:18")
        const formattedTime = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;
        
        // Formatear la magnitud (asegurando que tenga 1 decimal)
        const formattedMagnitude = parseFloat(earthquakeData.magnitud).toFixed(1);
        
        // Crear el array en el formato solicitado
        const resultArray = [
            formattedDate,               // Fecha en formato DD/MM/YYYY
            formattedTime,               // Hora en formato HH:MM:SS
            formattedMagnitude,          // Magnitud con 1 decimal
            earthquakeData.referencia,   // Referencia textual
            `${earthquakeData.latitud}, ${earthquakeData.longitud}`,  // Coordenadas
            earthquakeData.profundidad.toString()  // Profundidad como string
        ];

        res.status(200).json({ 
            success: true, 
            data: resultArray 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message
        });
    }
}
