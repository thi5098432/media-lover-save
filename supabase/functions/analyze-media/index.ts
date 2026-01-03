import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function detectPlatform(url: string): string {
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

function extractYouTubeId(url: string): string | null {
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

async function getYouTubeMetadata(videoId: string) {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analisando URL:', url);
    
    const platform = detectPlatform(url);
    console.log('Plataforma detectada:', platform);

    let title = `Conteúdo de ${platform}`;
    let thumbnail = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop';
    let author = 'Autor';

    // Para YouTube, extrair metadados via oEmbed
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

    // Formatos disponíveis baseados na plataforma
    const formats = [];
    
    // Vídeo formatos
    if (platform !== 'SoundCloud') {
      formats.push(
        { quality: '1080p', format: 'MP4', size: '~100MB', url, type: 'video' as const },
        { quality: '720p', format: 'MP4', size: '~50MB', url, type: 'video' as const },
        { quality: '480p', format: 'MP4', size: '~25MB', url, type: 'video' as const },
        { quality: '360p', format: 'MP4', size: '~15MB', url, type: 'video' as const }
      );
    }
    
    // Áudio formatos
    formats.push(
      { quality: '320kbps', format: 'MP3', size: '~5MB', url, type: 'audio' as const },
      { quality: '128kbps', format: 'MP3', size: '~2MB', url, type: 'audio' as const }
    );

    // Imagem para Instagram/Pinterest
    if (platform === 'Instagram' || platform === 'Pinterest') {
      formats.push({ quality: 'Original', format: 'JPG', url, type: 'image' as const });
    }

    const media = {
      title,
      thumbnail,
      platform,
      author,
      formats
    };

    console.log('Mídia analisada com sucesso:', media.title);
    
    return new Response(
      JSON.stringify({ success: true, media }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao analisar mídia:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
