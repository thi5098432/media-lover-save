import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SegmentInfo {
  url: string;
  duration: number;
}

// Parse m3u8 manifest and extract segment URLs
function parseM3U8(content: string, baseUrl: string): SegmentInfo[] {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const segments: SegmentInfo[] = [];
  let currentDuration = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Get duration from EXTINF
    if (line.startsWith('#EXTINF:')) {
      const match = line.match(/#EXTINF:([\d.]+)/);
      if (match) {
        currentDuration = parseFloat(match[1]);
      }
    }
    // Get segment URL (non-comment lines after EXTINF)
    else if (!line.startsWith('#') && currentDuration > 0) {
      let segmentUrl = line;
      
      // Handle relative URLs
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

// Check if m3u8 is a master playlist (contains other m3u8 references)
function isMasterPlaylist(content: string): boolean {
  return content.includes('#EXT-X-STREAM-INF');
}

// Extract the best quality stream from master playlist
function getBestStreamUrl(content: string, baseUrl: string): string | null {
  const lines = content.split('\n').map(line => line.trim());
  let bestBandwidth = 0;
  let bestUrl: string | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('#EXT-X-STREAM-INF')) {
      const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
      const bandwidth = bandwidthMatch ? parseInt(bandwidthMatch[1]) : 0;
      
      // Next non-comment line is the URL
      for (let j = i + 1; j < lines.length; j++) {
        if (!lines[j].startsWith('#') && lines[j].length > 0) {
          if (bandwidth > bestBandwidth) {
            bestBandwidth = bandwidth;
            let streamUrl = lines[j];
            
            // Handle relative URLs
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { m3u8Url } = await req.json();

    if (!m3u8Url) {
      return new Response(
        JSON.stringify({ error: 'URL do m3u8 é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processando HLS:', m3u8Url);

    // Fetch the m3u8 manifest
    let manifestUrl = m3u8Url;
    let manifestResponse = await fetch(manifestUrl);
    
    if (!manifestResponse.ok) {
      throw new Error(`Erro ao buscar manifest: ${manifestResponse.status}`);
    }

    let manifestContent = await manifestResponse.text();
    console.log('Manifest obtido, verificando tipo...');

    // If it's a master playlist, get the best quality stream
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

    // Parse segments
    const segments = parseM3U8(manifestContent, manifestUrl);
    console.log(`Encontrados ${segments.length} segmentos`);

    if (segments.length === 0) {
      throw new Error('Nenhum segmento encontrado no manifest');
    }

    // Calculate total duration
    const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
    console.log(`Duração total: ${totalDuration.toFixed(2)}s`);

    // Download all segments
    const segmentBuffers: Uint8Array[] = [];
    let downloadedSize = 0;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      console.log(`Baixando segmento ${i + 1}/${segments.length}...`);
      
      const segmentResponse = await fetch(segment.url);
      
      if (!segmentResponse.ok) {
        console.error(`Erro no segmento ${i + 1}: ${segmentResponse.status}`);
        continue;
      }
      
      const buffer = new Uint8Array(await segmentResponse.arrayBuffer());
      segmentBuffers.push(buffer);
      downloadedSize += buffer.length;
    }

    console.log(`Download completo: ${(downloadedSize / 1024 / 1024).toFixed(2)} MB`);

    // Combine all segments
    const totalLength = segmentBuffers.reduce((sum, buf) => sum + buf.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const buffer of segmentBuffers) {
      combined.set(buffer, offset);
      offset += buffer.length;
    }

    console.log('Segmentos combinados, enviando resposta...');

    // Return combined file as video/mp2t (MPEG-TS format)
    return new Response(combined, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'video/mp2t',
        'Content-Length': combined.length.toString(),
        'Content-Disposition': 'attachment; filename="video.ts"',
      },
    });

  } catch (error: unknown) {
    console.error('Erro no download HLS:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
