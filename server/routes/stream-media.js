import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { downloadUrl, mimeType } = req.body;

    if (!downloadUrl) {
      return res.status(400).json({ error: 'downloadUrl é obrigatório' });
    }

    console.log('Iniciando proxy para:', downloadUrl);

    const fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
      'Accept-Encoding': 'identity',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'video',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
    };

    console.log('Usando headers:', JSON.stringify(fetchHeaders));

    const response = await fetch(downloadUrl, {
      headers: fetchHeaders,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      console.error('Erro ao buscar arquivo:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: `Erro ao buscar arquivo: ${response.status}` 
      });
    }

    const contentType = response.headers.get('Content-Type');
    const contentLength = response.headers.get('Content-Length');

    console.log('Content-Type:', contentType);
    console.log('Content-Length:', contentLength);

    if (contentType?.includes('text/html')) {
      console.error('Resposta é HTML, link pode ter expirado');
      return res.status(400).json({ error: 'Link expirado ou inválido' });
    }

    if (contentLength === '0' || (contentLength === null && contentType === null)) {
      console.error('Resposta vazia detectada');
      return res.status(400).json({ 
        error: 'Resposta vazia - link expirado ou inacessível', 
        fallback: true 
      });
    }

    res.set({
      'Content-Type': mimeType || contentType || 'application/octet-stream',
      ...(contentLength && contentLength !== '0' ? { 'Content-Length': contentLength } : {}),
    });

    console.log('Iniciando stream do arquivo...');

    // Pipe the response body
    const reader = response.body.getReader();
    
    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      }
    });

    const nodeStream = require('stream').Readable.fromWeb(stream);
    nodeStream.pipe(res);

  } catch (error) {
    console.error('Erro no proxy:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Erro interno' 
    });
  }
});

export default router;
