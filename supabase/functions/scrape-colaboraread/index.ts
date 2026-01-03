import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VideoInfo {
  id: string;
  title: string;
  m3u8Url: string;
  embedUrl: string;
}

// Extract urlOrigem parameter from Colaboraread URL
function extractUrlOrigem(url: string): string | null {
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

// Extract MediaStream video IDs from HTML content
function extractMediaStreamIds(html: string): string[] {
  const patterns = [
    /mdstrm\.com\/embed\/([a-f0-9]+)/gi,
    /mdstrm\.com\/video\/([a-f0-9]+)/gi,
    /mediastream\.com\/embed\/([a-f0-9]+)/gi,
    /data-video-id=["']([a-f0-9]+)["']/gi,
  ];
  
  const ids = new Set<string>();
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      if (match[1] && match[1].length >= 20) { // MediaStream IDs are usually 24 chars
        ids.add(match[1]);
      }
    }
  }
  
  return Array.from(ids);
}

// Extract video titles from HTML (tries to find context near video embeds)
function extractVideoTitles(html: string, videoIds: string[]): Map<string, string> {
  const titles = new Map<string, string>();
  
  // Common patterns for video titles in educational content
  const titlePatterns = [
    /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi,
    /titulo[^>]*>([^<]+)</gi,
    /title[^>]*>([^<]+)</gi,
    /<strong>([^<]+)<\/strong>/gi,
  ];
  
  // Try to find titles near video embeds
  for (const videoId of videoIds) {
    const videoPattern = new RegExp(`(.{0,500}mdstrm\\.com\\/embed\\/${videoId}.{0,200})`, 'is');
    const contextMatch = html.match(videoPattern);
    
    if (contextMatch) {
      const context = contextMatch[1];
      // Look for heading tags before the video
      const headingMatch = context.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i);
      if (headingMatch) {
        titles.set(videoId, headingMatch[1].trim());
      }
    }
  }
  
  return titles;
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

    console.log('Analisando URL do Colaboraread:', url);

    // Check if it's a Colaboraread URL
    if (!url.includes('colaboraread.com.br')) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL não é do Colaboraread' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the urlOrigem parameter
    const urlOrigem = extractUrlOrigem(url);
    
    if (!urlOrigem) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Não foi possível extrair a URL de origem. Certifique-se de copiar a URL completa da página.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('URL de origem extraída:', urlOrigem);

    // Fetch the S3 content page
    const response = await fetch(urlOrigem, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      console.error('Erro ao buscar página:', response.status);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Erro ao acessar a página de conteúdo: ${response.status}` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await response.text();
    console.log('HTML recebido, tamanho:', html.length);

    // Extract MediaStream video IDs
    const videoIds = extractMediaStreamIds(html);
    console.log('Vídeos encontrados:', videoIds.length);

    if (videoIds.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Nenhum vídeo encontrado nesta página. Verifique se a aula contém vídeos.' 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to extract titles
    const titles = extractVideoTitles(html, videoIds);

    // Build video list
    const videos: VideoInfo[] = videoIds.map((id, index) => ({
      id,
      title: titles.get(id) || `Vídeo ${index + 1}`,
      m3u8Url: `https://mdstrm.com/video/${id}.m3u8`,
      embedUrl: `https://mdstrm.com/embed/${id}`,
    }));

    console.log('Vídeos processados:', videos);

    return new Response(
      JSON.stringify({ 
        success: true, 
        videos,
        count: videos.length,
        source: urlOrigem,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao processar Colaboraread:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
