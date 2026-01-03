import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { downloadUrl, mimeType } = await req.json();

    if (!downloadUrl) {
      return new Response(
        JSON.stringify({ error: 'downloadUrl é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Iniciando proxy para:', downloadUrl);

    // Headers that Cobalt tunnel expects - simulating a real browser
    const fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
      'Accept-Encoding': 'identity',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'video',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
    };

    console.log('Usando headers:', JSON.stringify(fetchHeaders));

    // Fetch the file from the source with proper headers
    const response = await fetch(downloadUrl, {
      headers: fetchHeaders,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      console.error('Erro ao buscar arquivo:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: `Erro ao buscar arquivo: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const contentType = response.headers.get('Content-Type');
    const contentLength = response.headers.get('Content-Length');

    console.log('Content-Type:', contentType);
    console.log('Content-Length:', contentLength);

    // Check if response is HTML (error page)
    if (contentType?.includes('text/html')) {
      console.error('Resposta é HTML, link pode ter expirado');
      return new Response(
        JSON.stringify({ error: 'Link expirado ou inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for empty response (Content-Length: 0 or null Content-Type)
    if (contentLength === '0' || (contentLength === null && contentType === null)) {
      console.error('Resposta vazia detectada - link pode ter expirado ou headers incorretos');
      return new Response(
        JSON.stringify({ error: 'Resposta vazia - link expirado ou inacessível', fallback: true }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response back with CORS headers
    const headers: Record<string, string> = {
      ...corsHeaders,
      'Content-Type': mimeType || contentType || 'application/octet-stream',
    };

    if (contentLength && contentLength !== '0') {
      headers['Content-Length'] = contentLength;
    }

    console.log('Iniciando stream do arquivo...');

    return new Response(response.body, { headers });

  } catch (error: unknown) {
    console.error('Erro no proxy:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
