import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Instâncias comunitárias do Cobalt (fallback system)
const COBALT_INSTANCES = [
  'https://cobalt-api.meowing.de',
  'https://cobalt-api.kwiatekmiki.com',
  'https://cobalt-backend.canine.tools',
  'https://capi.3kh0.net',
  'https://api.cobalt.best',
  'https://cobalt.api.timelessnesses.me',
];

// Helper to call internal functions with timeout
async function fetchWithTimeout(
  resource: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<Response> {
  const { timeout = 15000, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(resource, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// Check if URL is from YouTube
function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}

// Call dedicated YouTube download function
async function callYouTubeDownload(
  url: string,
  quality: string,
): Promise<{ success: boolean; downloadUrl?: string; filename?: string; error?: string }> {
  console.log('Detectado YouTube, usando API dedicada...');
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (!supabaseUrl) {
    console.error('SUPABASE_URL não configurada');
    return { success: false, error: 'Configuração interna ausente' };
  }

  try {
    const response = await fetchWithTimeout(`${supabaseUrl}/functions/v1/youtube-download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
      body: JSON.stringify({ url, quality }),
      timeout: 15000,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      console.error('Erro na função youtube-download:', response.status, data);
      return { success: false, error: data?.error || 'Falha na API de download do YouTube' };
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Timeout na função youtube-download');
      return { success: false, error: 'Timeout ao tentar obter link do YouTube' };
    }

    console.error('Erro ao chamar youtube-download:', error);
    return { success: false, error: 'Erro ao chamar API de download do YouTube' };
  }
}

interface CobaltRequest {
  url: string;
  videoQuality?: string;
  audioFormat?: string;
  downloadMode?: 'auto' | 'audio' | 'mute';
  filenameStyle?: 'classic' | 'pretty' | 'basic' | 'nerdy';
}

interface CobaltResponse {
  status: 'error' | 'redirect' | 'tunnel' | 'picker';
  url?: string;
  filename?: string;
  error?: {
    code: string;
  };
  picker?: Array<{
    type: 'video' | 'photo';
    url: string;
    thumb?: string;
  }>;
}

async function callCobaltInstance(instanceUrl: string, params: CobaltRequest): Promise<CobaltResponse> {
  console.log(`Tentando instância: ${instanceUrl}`);
  
  const response = await fetch(instanceUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'LovableDownloader/1.0 (+https://lovable.dev)',
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

async function callCobaltWithFallback(params: CobaltRequest): Promise<CobaltResponse> {
  let lastError: Error | null = null;
  
  for (const instance of COBALT_INSTANCES) {
    try {
      const response = await callCobaltInstance(instance, params);
      
      // Se a resposta for um erro da API (não HTTP), tenta próxima instância
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

function mapQualityToCobalt(quality: string): { videoQuality?: string; downloadMode?: 'auto' | 'audio' } {
  // Audio qualities
  if (quality.includes('kbps')) {
    return { downloadMode: 'audio' };
  }
  
  // Video qualities
  const qualityMap: Record<string, string> = {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, quality, type } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processando download:', { url, quality, type });

    // YOUTUBE: Use dedicated API that returns direct URLs
    if (isYouTubeUrl(url)) {
      const ytResult = await callYouTubeDownload(url, quality || '720p');
      
      if (ytResult.success && ytResult.downloadUrl) {
        console.log('YouTube download URL obtida (direta)');
        return new Response(
          JSON.stringify({ 
            success: true, 
            downloadUrl: ytResult.downloadUrl,
            filename: ytResult.filename,
            isTunnel: false // Direct URL, can be proxied
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // If YouTube API fails, try Cobalt as fallback
      console.log('YouTube API falhou, tentando Cobalt como fallback...');
    }

    // OTHER PLATFORMS: Use Cobalt
    const qualityParams = mapQualityToCobalt(quality || '720p');
    
    // Se for áudio, forçar downloadMode para 'audio'
    if (type === 'audio') {
      qualityParams.downloadMode = 'audio';
    }

    const cobaltResponse = await callCobaltWithFallback({
      url,
      ...qualityParams,
      audioFormat: 'mp3',
      filenameStyle: 'pretty',
    });

    // Tratar diferentes tipos de resposta
    if (cobaltResponse.status === 'error') {
      console.error('Cobalt error:', cobaltResponse.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Erro ao processar: ${cobaltResponse.error?.code || 'desconhecido'}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (cobaltResponse.status === 'redirect' || cobaltResponse.status === 'tunnel') {
      // For YouTube tunnel links that slipped through, mark as tunnel
      // For other platforms, redirect links work fine with proxy
      const isTunnel = cobaltResponse.status === 'tunnel' && isYouTubeUrl(url);
      console.log(`Download URL obtida (${cobaltResponse.status}, isTunnel: ${isTunnel}):`, cobaltResponse.url);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          downloadUrl: cobaltResponse.url,
          filename: cobaltResponse.filename,
          isTunnel // Only true for YouTube tunnel links
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (cobaltResponse.status === 'picker' && cobaltResponse.picker) {
      // Se houver múltiplas opções, retornar a primeira ou todas
      const firstItem = cobaltResponse.picker[0];
      console.log('Picker response, usando primeiro item:', firstItem);
      return new Response(
        JSON.stringify({ 
          success: true, 
          downloadUrl: firstItem.url,
          picker: cobaltResponse.picker,
          isTunnel: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Resposta inesperada da API' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao processar download:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
