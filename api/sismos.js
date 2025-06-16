import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://ultimosismo.igp.gob.pe/', { waitUntil: 'networkidle0' });

    // Esperar al contenedor principal
    await page.waitForSelector('.p-2.pl-3.position-relative.bg-green.text-white', { timeout: 5000 });

    // Extraer los datos
    const data = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.textContent.trim() : '';
      };

      const magnitud = document.querySelector('.p-2.pl-3.position-relative.bg-green.text-white strong span')?.innerText.trim() || '';
      const referencia = document.querySelector('.p-2.pl-3.position-relative.bg-green.text-white p.reference span')?.innerText.trim() || '';

      return [ magnitud, referencia];
    });

    await browser.close();

    if (!data || data.some(d => d === '')) {
      return res.status(500).json({ success: false, message: 'No se pudieron obtener todos los datos' });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
