import { Router } from 'express';

const router = Router();

function extractUrlOrigem(url) {
  try {
    const urlObj = new URL(url);
    const urlOrigem = urlObj.searchParams.get('urlOrigem');
    if (urlOrigem) {
      return decodeURIComponent(urlOrigem);
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
  }
  return null;
}

function extractMediaStreamIds(html) {
  const patterns = [
    /mdstrm\.com\/embed\/([a-f0-9]+)/gi,
    /mdstrm\.com\/video\/([a-f0-9]+)/gi,
    /mediastream\.com\/embed\/([a-f0-9]+)/gi,
    /data-video-id=["']([a-f0-9]+)["']/gi,
  ];
  
  const ids = new Set();
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      if (match[1] && match[1].length >= 20) {
        ids.add(match[1]);
      }
    }
  }
  
  return Array.from(ids);
}

function extractVideoTitles(html, videoIds) {
  const titles = new Map();
  
  for (const videoId of videoIds) {
    const videoPattern = new RegExp(`(.{0,500}mdstrm\\.com\\/embed\\/${videoId}.{0,200})`, 'is');
    const contextMatch = html.match(videoPattern);
    
    if (contextMatch) {
      const context = contextMatch[1];
      const headingMatch = context.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i);
      if (headingMatch) {
        titles.set(videoId, headingMatch[1].trim());
      }
    }
  }
  
  return titles;
}

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL é obrigatória' });
    }

    console.log('Analisando URL do Colaboraread:', url);

    if (!url.includes('colaboraread.com.br')) {
      return res.status(400).json({ success: false, error: 'URL não é do Colaboraread' });
    }

    const urlOrigem = extractUrlOrigem(url);
    
    if (!urlOrigem) {
      return res.status(400).json({ 
        success: false, 
        error: 'Não foi possível extrair a URL de origem. Certifique-se de copiar a URL completa da página.' 
      });
    }

    console.log('URL de origem extraída:', urlOrigem);

    const response = await fetch(urlOrigem, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      console.error('Erro ao buscar página:', response.status);
      return res.status(500).json({ 
        success: false, 
        error: `Erro ao acessar a página de conteúdo: ${response.status}` 
      });
    }

    const html = await response.text();
    console.log('HTML recebido, tamanho:', html.length);

    const videoIds = extractMediaStreamIds(html);
    console.log('Vídeos encontrados:', videoIds.length);

    if (videoIds.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Nenhum vídeo encontrado nesta página. Verifique se a aula contém vídeos.' 
      });
    }

    const titles = extractVideoTitles(html, videoIds);

    const videos = videoIds.map((id, index) => ({
      id,
      title: titles.get(id) || `Vídeo ${index + 1}`,
      m3u8Url: `https://mdstrm.com/video/${id}.m3u8`,
      embedUrl: `https://mdstrm.com/embed/${id}`,
    }));

    console.log('Vídeos processados:', videos);

    res.json({ 
      success: true, 
      videos,
      count: videos.length,
      source: urlOrigem,
    });

  } catch (error) {
    console.error('Erro ao processar Colaboraread:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    });
  }
});

export default router;
