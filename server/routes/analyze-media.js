import { Router } from 'express';

const router = Router();

function detectPlatform(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook';
  if (url.includes('vimeo.com')) return 'Vimeo';
  if (url.includes('reddit.com')) return 'Reddit';
  if (url.includes('soundcloud.com')) return 'SoundCloud';
  if (url.includes('pinterest.com')) return 'Pinterest';
  return 'Desconhecido';
}

function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function getYouTubeMetadata(videoId) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Erro ao buscar metadados do YouTube:', error);
  }
  return null;
}

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL é obrigatória' });
    }

    console.log('Analisando URL:', url);
    
    const platform = detectPlatform(url);
    console.log('Plataforma detectada:', platform);

    let title = `Conteúdo de ${platform}`;
    let thumbnail = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop';
    let author = 'Autor';

    if (platform === 'YouTube') {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        const metadata = await getYouTubeMetadata(videoId);
        if (metadata) {
          title = metadata.title || title;
          author = metadata.author_name || author;
          thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
    }

    const formats = [];
    
    if (platform !== 'SoundCloud') {
      formats.push(
        { quality: '1080p', format: 'MP4', size: '~100MB', url, type: 'video' },
        { quality: '720p', format: 'MP4', size: '~50MB', url, type: 'video' },
        { quality: '480p', format: 'MP4', size: '~25MB', url, type: 'video' },
        { quality: '360p', format: 'MP4', size: '~15MB', url, type: 'video' }
      );
    }
    
    formats.push(
      { quality: '320kbps', format: 'MP3', size: '~5MB', url, type: 'audio' },
      { quality: '128kbps', format: 'MP3', size: '~2MB', url, type: 'audio' }
    );

    if (platform === 'Instagram' || platform === 'Pinterest') {
      formats.push({ quality: 'Original', format: 'JPG', url, type: 'image' });
    }

    const media = {
      title,
      thumbnail,
      platform,
      author,
      formats
    };

    console.log('Mídia analisada com sucesso:', media.title);
    
    res.json({ success: true, media });

  } catch (error) {
    console.error('Erro ao analisar mídia:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    });
  }
});

export default router;
