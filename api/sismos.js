import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const url = 'https://ultimosismo.igp.gob.pe/';

export default async function handler(req, res) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al obtener la página: ${response.statusText}`);

        const html = await response.text();
        const $ = cheerio.load(html);

        // Seleccionamos el div que contiene la magnitud y referencia
        const mainDiv = $('.p-2.pl-3.position-relative.bg-green.text-white').first();

        // Obtener magnitud
        const magnitud = mainDiv.find('strong span').first().text().trim();

        // Obtener referencia
        const referencia = mainDiv.find('p.reference span').first().text().trim();

        // Respuesta JSON
        res.status(200).json({
            success: true,
            data: {
                magnitud,
                referencia
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
