import { Router } from 'express';

const router = Router();

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(resource, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function getYouTubeDownloadUrl(url, quality) {
  console.log('Tentando extrair URL direta do YouTube...');
  
  const videoId = extractVideoId(url);
  if (!videoId) {
    console.log('Não foi possível extrair video ID');
    return null;
  }
  
  console.log('Video ID:', videoId);
  
  const invidiousInstances = [
    'https://yewtu.be',
    'https://invidious.nerdvpn.de',
    'https://inv.perditum.com',
    'https://invidious.f5.si',
  ];
  
  for (const instance of invidiousInstances) {
    try {
      console.log(`Tentando Invidious: ${instance}`);
      
      const response = await fetchWithTimeout(`${instance}/api/v1/videos/${videoId}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 8000,
      });
      
      if (!response.ok) {
        console.log(`Invidious ${instance} retornou ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`Invidious ${instance} respondeu, processando formatos...`);
      
      const formats = data.adaptiveFormats || [];
      const title = data.title || 'video';
      
      const qualityMap = {
        '2160p': 2160,
        '1440p': 1440,
        '1080p': 1080,
        '720p': 720,
        '480p': 480,
        '360p': 360,
        '240p': 240,
        '144p': 144,
      };
      
      const targetRes = qualityMap[quality] || 720;
      
      const videoFormats = formats.filter(f => f.type?.startsWith('video/'));
      
      videoFormats.sort((a, b) => {
        const aDiff = Math.abs((a.resolution || 0) - targetRes);
        const bDiff = Math.abs((b.resolution || 0) - targetRes);
        return aDiff - bDiff;
      });
      
      if (videoFormats.length > 0) {
        const format = videoFormats[0];
        console.log(`Formato encontrado: ${format.qualityLabel || format.resolution}p`);
        return {
          url: format.url,
          filename: `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${format.qualityLabel || quality}.mp4`,
        };
      }
      
      const combinedFormats = data.formatStreams || [];
      if (combinedFormats.length > 0) {
        const format = combinedFormats[0];
        return {
          url: format.url,
          filename: `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${quality}.mp4`,
        };
      }
      
    } catch (error) {
      console.error(`Erro em ${instance}:`, error);
    }
  }
  
  console.log('Todas as instâncias Invidious falharam');
  return null;
}

async function getPipedDownloadUrl(url, quality) {
  console.log('Tentando Piped API...');
  
  const videoId = extractVideoId(url);
  if (!videoId) return null;
  
  const pipedInstances = [
    'https://pipedapi.adminforge.de',
    'https://piped-api.lunar.icu',
    'https://pipedapi.astartes.nl',
    'https://pipedapi.ducks.party',
    'https://pipedapi.kavin.rocks',
  ];
  
  for (const instance of pipedInstances) {
    try {
      console.log(`Tentando Piped: ${instance}`);
      
      const response = await fetchWithTimeout(`${instance}/streams/${videoId}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 8000,
      });
      
      if (!response.ok) {
        console.log(`Piped ${instance} retornou ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`Piped ${instance} respondeu, processando...`);
      
      const title = data.title || 'video';
      const qualityMap = {
        '2160p': 2160, '1440p': 1440, '1080p': 1080,
        '720p': 720, '480p': 480, '360p': 360,
      };
      const targetRes = qualityMap[quality] || 720;
      
      const videoStreams = data.videoStreams || [];
      
      const match = videoStreams.find(s => {
        const height = parseInt(s.quality?.replace('p', '') || '0');
        return Math.abs(height - targetRes) <= 100;
      });
      
      if (match) {
        return {
          url: match.url,
          filename: `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${quality}.mp4`,
        };
      }
      
      if (videoStreams.length > 0) {
        return {
          url: videoStreams[0].url,
          filename: `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${quality}.mp4`,
        };
      }
      
    } catch (error) {
      console.error(`Erro em ${instance}:`, error);
    }
  }
  
  return null;
}

router.post('/', async (req, res) => {
  try {
    const { url, quality } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL é obrigatória' });
    }

    console.log('Processando YouTube download:', { url, quality });

    let result = await getYouTubeDownloadUrl(url, quality || '720p');
    
    if (!result) {
      result = await getPipedDownloadUrl(url, quality || '720p');
    }
    
    if (result) {
      console.log('URL direta obtida:', result.url.substring(0, 100) + '...');
      return res.json({ 
        success: true, 
        downloadUrl: result.url,
        filename: result.filename,
        isDirect: true
      });
    }

    res.status(400).json({ 
      success: false, 
      error: 'Não foi possível obter link direto do YouTube. Tente novamente.' 
    });

  } catch (error) {
    console.error('Erro ao processar YouTube download:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

export default router;
