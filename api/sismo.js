
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const url = 'https://coeseducacion.pe/sismos/';

export default async function handler(req, res) {
    try {
        // Hacer la solicitud HTTP
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al obtener la página: ${response.statusText}`);

        const html = await response.text();
        const $ = cheerio.load(html);

        // Seleccionar los primeros 6 elementos panel-body
        const panelBodies = $('.panel-body').slice(3, 9);

        const spanValues = []; // Array para almacenar los valores de los <span>

        panelBodies.each((index, element) => {
            if (index === 2) {
                // Tercer match: solo el primer <span>
                const firstSpan = $(element).find('span').first();
                if (firstSpan.length > 0) {
                    const spanText = firstSpan.text().trim();
                    spanValues.push(spanText);
                }
            } else {
                // Todos los <span> para los demás matches
                const spans = $(element).find('span');
                spans.each((_, span) => {
                    const spanText = $(span).text().trim();
                    spanValues.push(spanText);
                });
            }
        });

        // Retornar los valores extraídos
        res.status(200).json({ success: true, data: spanValues });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}






/*
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const url = 'https://coeseducacion.pe/sismos/';

// Palabras clave asociadas a Lima, sus provincias y el mar de sus costas
const keywords = [
    'Lima',
    'Callao',
    'Barranca',
    'Cañete',
    'Huaral',
    'Huarochirí',
    'Cajatambo',
    'Yauyos',
    'Canta',
    'Oyón',
    'Huaura',
   
];

export default async function handler(req, res) {
    try {
        // Hacer la solicitud HTTP
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al obtener la página: ${response.statusText}`);

        const html = await response.text();
        const $ = cheerio.load(html);

        // Seleccionar los primeros 6 elementos panel-body
        const panelBodies = $('.panel-body').slice(3, 9);

        const filteredValues = []; // Array para almacenar los valores filtrados

        panelBodies.each((index, element) => {
            if (index === 2) {
                // Tercer match: solo el primer <span>
                const firstSpan = $(element).find('span').first();
                if (firstSpan.length > 0) {
                    const spanText = firstSpan.text().trim();
                    if (keywords.some(keyword => spanText.includes(keyword))) {
                        filteredValues.push(spanText);
                    }
                }
            } else {
                // Todos los <span> para los demás matches
                const spans = $(element).find('span');
                spans.each((_, span) => {
                    const spanText = $(span).text().trim();
                    if (keywords.some(keyword => spanText.includes(keyword))) {
                        filteredValues.push(spanText);
                    }
                });
            }
        });

        // Retornar los valores filtrados
        res.status(200).json({ success: true, data: filteredValues });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
*/

/*
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const url = 'https://coeseducacion.pe/sismos/';

export default async function handler(req, res) {
    try {
        // Hacer la solicitud HTTP
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al obtener la página: ${response.statusText}`);

        const html = await response.text();
        const $ = cheerio.load(html);

        // Seleccionar los primeros 6 elementos panel-body
        const panelBodies = $('.panel-body').slice(3, 9);

        const spanValues = []; // Array para almacenar los valores de los <span>

        panelBodies.each((index, element) => {
            if (index === 2) {
                // Tercer match: solo el primer <span>
                const firstSpan = $(element).find('span').first();
                if (firstSpan.length > 0) {
                    const spanText = firstSpan.text().trim();
                    spanValues.push(spanText);
                }
            } else {
                // Todos los <span> para los demás matches
                const spans = $(element).find('span');
                spans.each((_, span) => {
                    const spanText = $(span).text().trim();
                    spanValues.push(spanText);
                });
            }
        });

        // Crear el timestamp uniendo fecha y hora
        const [date, time, magnitude, location, coordinates, depth] = spanValues;

        if (date && time) {
            // Convertir la fecha y hora al formato timestamp
            const [day, month, year] = date.split('/');
            const timestamp = new Date(`${year}-${month}-${day}T${time}`).getTime();

            res.status(200).json({
                success: true,
                data: {
                    id: timestamp, // Timestamp en milisegundos
                    date,
                    time,
                    magnitude,
                    location,
                    coordinates,
                    depth,
                },
            });
        } else {
            throw new Error("No se encontraron datos válidos para fecha y hora.");
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
*/