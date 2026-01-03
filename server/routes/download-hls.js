import { Router } from 'express';

const router = Router();

function parseM3U8(content, baseUrl) {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const segments = [];
  let currentDuration = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      const match = line.match(/#EXTINF:([\d.]+)/);
      if (match) {
        currentDuration = parseFloat(match[1]);
      }
    }
    else if (!line.startsWith('#') && currentDuration > 0) {
      let segmentUrl = line;
      
      if (!segmentUrl.startsWith('http')) {
        const urlObj = new URL(baseUrl);
        if (segmentUrl.startsWith('/')) {
          segmentUrl = `${urlObj.origin}${segmentUrl}`;
        } else {
          const pathParts = urlObj.pathname.split('/');
          pathParts.pop();
          segmentUrl = `${urlObj.origin}${pathParts.join('/')}/${segmentUrl}`;
        }
      }
      
      segments.push({ url: segmentUrl, duration: currentDuration });
      currentDuration = 0;
    }
  }

  return segments;
}

function isMasterPlaylist(content) {
  return content.includes('#EXT-X-STREAM-INF');
}

function getBestStreamUrl(content, baseUrl) {
  const lines = content.split('\n').map(line => line.trim());
  let bestBandwidth = 0;
  let bestUrl = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('#EXT-X-STREAM-INF')) {
      const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
      const bandwidth = bandwidthMatch ? parseInt(bandwidthMatch[1]) : 0;
      
      for (let j = i + 1; j < lines.length; j++) {
        if (!lines[j].startsWith('#') && lines[j].length > 0) {
          if (bandwidth > bestBandwidth) {
            bestBandwidth = bandwidth;
            let streamUrl = lines[j];
            
            if (!streamUrl.startsWith('http')) {
              const urlObj = new URL(baseUrl);
              if (streamUrl.startsWith('/')) {
                streamUrl = `${urlObj.origin}${streamUrl}`;
              } else {
                const pathParts = urlObj.pathname.split('/');
                pathParts.pop();
                streamUrl = `${urlObj.origin}${pathParts.join('/')}/${streamUrl}`;
              }
            }
            bestUrl = streamUrl;
          }
          break;
        }
      }
    }
  }
  
  return bestUrl;
}

router.post('/', async (req, res) => {
  try {
    const { m3u8Url } = req.body;

    if (!m3u8Url) {
      return res.status(400).json({ error: 'URL do m3u8 é obrigatória' });
    }

    console.log('Processando HLS:', m3u8Url);

    let manifestUrl = m3u8Url;
    let manifestResponse = await fetch(manifestUrl);
    
    if (!manifestResponse.ok) {
      throw new Error(`Erro ao buscar manifest: ${manifestResponse.status}`);
    }

    let manifestContent = await manifestResponse.text();
    console.log('Manifest obtido, verificando tipo...');

    if (isMasterPlaylist(manifestContent)) {
      console.log('Master playlist detectada, buscando melhor qualidade...');
      const bestStreamUrl = getBestStreamUrl(manifestContent, manifestUrl);
      
      if (!bestStreamUrl) {
        throw new Error('Não foi possível encontrar stream no master playlist');
      }
      
      console.log('Melhor stream:', bestStreamUrl);
      manifestUrl = bestStreamUrl;
      manifestResponse = await fetch(manifestUrl);
      
      if (!manifestResponse.ok) {
        throw new Error(`Erro ao buscar stream manifest: ${manifestResponse.status}`);
      }
      
      manifestContent = await manifestResponse.text();
    }

    const segments = parseM3U8(manifestContent, manifestUrl);
    console.log(`Encontrados ${segments.length} segmentos`);

    if (segments.length === 0) {
      throw new Error('Nenhum segmento encontrado no manifest');
    }

    const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
    console.log(`Duração total: ${totalDuration.toFixed(2)}s`);

    const segmentBuffers = [];
    let downloadedSize = 0;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      console.log(`Baixando segmento ${i + 1}/${segments.length}...`);
      
      const segmentResponse = await fetch(segment.url);
      
      if (!segmentResponse.ok) {
        console.error(`Erro no segmento ${i + 1}: ${segmentResponse.status}`);
        continue;
      }
      
      const buffer = await segmentResponse.arrayBuffer();
      segmentBuffers.push(Buffer.from(buffer));
      downloadedSize += buffer.byteLength;
    }

    console.log(`Download completo: ${(downloadedSize / 1024 / 1024).toFixed(2)} MB`);

    const combined = Buffer.concat(segmentBuffers);

    console.log('Segmentos combinados, enviando resposta...');

    res.set({
      'Content-Type': 'video/mp2t',
      'Content-Length': combined.length.toString(),
      'Content-Disposition': 'attachment; filename="video.ts"',
    });

    res.send(combined);

  } catch (error) {
    console.error('Erro no download HLS:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Erro interno' 
    });
  }
});

export default router;
