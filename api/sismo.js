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
