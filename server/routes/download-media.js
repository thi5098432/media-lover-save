import { Router } from 'express';

const router = Router();

const COBALT_INSTANCES = [
  'https://cobalt-api.meowing.de',
  'https://cobalt-api.kwiatekmiki.com',
  'https://cobalt-backend.canine.tools',
  'https://capi.3kh0.net',
  'https://api.cobalt.best',
  'https://cobalt.api.timelessnesses.me',
];

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 15000, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(resource, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

function isYouTubeUrl(url) {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}

async function callYouTubeDownload(url, quality, baseUrl) {
  console.log('Detectado YouTube, usando API dedicada...');

  try {
    const response = await fetchWithTimeout(`${baseUrl}/api/youtube-download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, quality }),
      timeout: 15000,
    });

    const data = await response.json();

    if (!response.ok || !data) {
      console.error('Erro na função youtube-download:', response.status, data);
      return { success: false, error: data?.error || 'Falha na API de download do YouTube' };
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Timeout na função youtube-download');
      return { success: false, error: 'Timeout ao tentar obter link do YouTube' };
    }

    console.error('Erro ao chamar youtube-download:', error);
    return { success: false, error: 'Erro ao chamar API de download do YouTube' };
  }
}

async function callCobaltInstance(instanceUrl, params) {
  console.log(`Tentando instância: ${instanceUrl}`);
  
  const response = await fetch(instanceUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'SaveClipDownloader/1.0',
    },
    body: JSON.stringify({
      url: params.url,
      videoQuality: params.videoQuality || '720',
      audioFormat: params.audioFormat || 'mp3',
      downloadMode: params.downloadMode || 'auto',
      filenameStyle: params.filenameStyle || 'pretty',
    }),
  });

  if (!response.ok) {
    throw new Error(`Instância ${instanceUrl} retornou status ${response.status}`);
  }

  const data = await response.json();
  console.log(`Resposta de ${instanceUrl}:`, JSON.stringify(data));
  return data;
}

async function callCobaltWithFallback(params) {
  let lastError = null;
  
  for (const instance of COBALT_INSTANCES) {
    try {
      const response = await callCobaltInstance(instance, params);
      
      if (response.status === 'error') {
        console.log(`Erro da API em ${instance}: ${response.error?.code}`);
        lastError = new Error(response.error?.code || 'Erro desconhecido');
        continue;
      }
      
      console.log(`Sucesso com instância: ${instance}`);
      return response;
    } catch (error) {
      console.error(`Falha na instância ${instance}:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }
  
  throw lastError || new Error('Todas as instâncias falharam');
}

function mapQualityToCobalt(quality) {
  if (quality.includes('kbps')) {
    return { downloadMode: 'audio' };
  }
  
  const qualityMap = {
    '2160p': '2160',
    '1440p': '1440',
    '1080p': '1080',
    '720p': '720',
    '480p': '480',
    '360p': '360',
    '240p': '240',
    '144p': '144',
  };
  
  return { 
    videoQuality: qualityMap[quality] || '720',
    downloadMode: 'auto'
  };
}

router.post('/', async (req, res) => {
  try {
    const { url, quality, type } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL é obrigatória' });
    }

    console.log('Processando download:', { url, quality, type });

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    if (isYouTubeUrl(url)) {
      const ytResult = await callYouTubeDownload(url, quality || '720p', baseUrl);
      
      if (ytResult.success && ytResult.downloadUrl) {
        console.log('YouTube download URL obtida (direta)');
        return res.json({ 
          success: true, 
          downloadUrl: ytResult.downloadUrl,
          filename: ytResult.filename,
          isTunnel: false
        });
      }
      
      console.log('YouTube API falhou, tentando Cobalt como fallback...');
    }

    const qualityParams = mapQualityToCobalt(quality || '720p');
    
    if (type === 'audio') {
      qualityParams.downloadMode = 'audio';
    }

    const cobaltResponse = await callCobaltWithFallback({
      url,
      ...qualityParams,
      audioFormat: 'mp3',
      filenameStyle: 'pretty',
    });

    if (cobaltResponse.status === 'error') {
      console.error('Cobalt error:', cobaltResponse.error);
      return res.status(400).json({ 
        success: false, 
        error: `Erro ao processar: ${cobaltResponse.error?.code || 'desconhecido'}` 
      });
    }

    if (cobaltResponse.status === 'redirect' || cobaltResponse.status === 'tunnel') {
      const isTunnel = cobaltResponse.status === 'tunnel' && isYouTubeUrl(url);
      console.log(`Download URL obtida (${cobaltResponse.status}, isTunnel: ${isTunnel}):`, cobaltResponse.url);
      
      return res.json({ 
        success: true, 
        downloadUrl: cobaltResponse.url,
        filename: cobaltResponse.filename,
        isTunnel
      });
    }

    if (cobaltResponse.status === 'picker' && cobaltResponse.picker) {
      const firstItem = cobaltResponse.picker[0];
      console.log('Picker response, usando primeiro item:', firstItem);
      return res.json({ 
        success: true, 
        downloadUrl: firstItem.url,
        picker: cobaltResponse.picker,
        isTunnel: false
      });
    }

    res.status(500).json({ success: false, error: 'Resposta inesperada da API' });

  } catch (error) {
    console.error('Erro ao processar download:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    });
  }
});

export default router;
