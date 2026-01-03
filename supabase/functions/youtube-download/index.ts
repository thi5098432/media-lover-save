import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to add timeout to external API calls
async function fetchWithTimeout(
  resource: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<Response> {
  const { timeout = 8000, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(resource, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// Extract video ID from various YouTube URL formats
function extractVideoId(url: string): string | null {
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

// Use yt-dlp web service for reliable extraction
async function getYouTubeDownloadUrl(url: string, quality: string): Promise<{ url: string; filename: string } | null> {
  console.log('Tentando extrair URL direta do YouTube...');
  
  const videoId = extractVideoId(url);
  if (!videoId) {
    console.log('Não foi possível extrair video ID');
    return null;
  }
  
  console.log('Video ID:', videoId);
  
  // Try using invidious instances (return direct URLs)
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
      
      // Get adaptive formats (direct URLs)
      const formats = data.adaptiveFormats || [];
      const title = data.title || 'video';
      
      // Map quality to resolution
      const qualityMap: Record<string, number> = {
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
      
      // Find best matching video format
      const videoFormats = formats.filter((f: any) => f.type?.startsWith('video/'));
      
      // Sort by resolution, prefer the one closest to target
      videoFormats.sort((a: any, b: any) => {
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
      
      // Fallback to formatStreams (combined audio+video)
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

// Fallback: Use piped.video API
async function getPipedDownloadUrl(url: string, quality: string): Promise<{ url: string; filename: string } | null> {
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
      const qualityMap: Record<string, number> = {
        '2160p': 2160, '1440p': 1440, '1080p': 1080,
        '720p': 720, '480p': 480, '360p': 360,
      };
      const targetRes = qualityMap[quality] || 720;
      
      // Get video streams
      const videoStreams = data.videoStreams || [];
      
      // Find best match
      const match = videoStreams.find((s: any) => {
        const height = parseInt(s.quality?.replace('p', '') || '0');
        return Math.abs(height - targetRes) <= 100;
      });
      
      if (match) {
        return {
          url: match.url,
          filename: `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${quality}.mp4`,
        };
      }
      
      // Fallback to first available
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, quality } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processando YouTube download:', { url, quality });

    // Try Invidious first
    let result = await getYouTubeDownloadUrl(url, quality || '720p');
    
    // Fallback to Piped
    if (!result) {
      result = await getPipedDownloadUrl(url, quality || '720p');
    }
    
    if (result) {
      console.log('URL direta obtida:', result.url.substring(0, 100) + '...');
      return new Response(
        JSON.stringify({ 
          success: true, 
          downloadUrl: result.url,
          filename: result.filename,
          isDirect: true // Indicates this is a direct CDN URL, not a tunnel
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If all APIs fail, return error
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Não foi possível obter link direto do YouTube. Tente novamente.' 
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao processar YouTube download:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
