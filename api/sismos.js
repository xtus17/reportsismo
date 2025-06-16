import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const url = 'https://ultimosismo.igp.gob.pe/';

export default async function handler(req, res) {
    try {
        // Hacer la solicitud HTTP
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al obtener la página: ${response.statusText}`);

        const html = await response.text();
        const $ = cheerio.load(html);

        // Seleccionar el div específico
        const earthquakeDiv = $('.p-2.pl-3.position-relative.bg-green.text-white');

        // Extraer los valores necesarios
        const magnitude = earthquakeDiv.find('.mg-us strong span').text().trim();
        const reference = earthquakeDiv.find('.reference span').text().trim();

        // Crear objeto con los datos extraídos
        const earthquakeData = {
            magnitude: magnitude,
            reference: reference
        };

        // Retornar los valores extraídos
        res.status(200).json({ success: true, data: earthquakeData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
