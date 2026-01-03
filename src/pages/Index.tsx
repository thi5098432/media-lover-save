import { useState, useRef } from 'react';
import { toast } from 'sonner';
import HeroSection from '@/components/HeroSection';
import UrlInput from '@/components/UrlInput';
import SupportedPlatforms from '@/components/SupportedPlatforms';
import HowToUse from '@/components/HowToUse';
import FAQ from '@/components/FAQ';
import MediaPreview from '@/components/MediaPreview';
import DownloadOptions from '@/components/DownloadOptions';
import DownloadProgress from '@/components/DownloadProgress';
import ColaborareadVideoList from '@/components/ColaborareadVideoList';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import CopyrightDisclaimer from '@/components/CopyrightDisclaimer';
import { api } from '@/lib/api';

interface MediaInfo {
  title: string;
  thumbnail: string;
  duration?: string;
  platform: string;
  author?: string;
  embedUrl?: string;
  formats: {
    quality: string;
    format: string;
    size?: string;
    url: string;
    type: 'video' | 'audio' | 'image';
  }[];
}

interface ColaborareadVideo {
  id: string;
  title: string;
  m3u8Url: string;
  embedUrl: string;
}

interface DownloadState {
  isDownloading: boolean;
  progress: number;
  blob: Blob | null;
  fileName: string;
  fileSize: string;
  isComplete: boolean;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [colaborareadVideos, setColaborareadVideos] = useState<ColaborareadVideo[]>([]);
  const [downloadState, setDownloadState] = useState<DownloadState>({
    isDownloading: false,
    progress: 0,
    blob: null,
    fileName: '',
    fileSize: '',
    isComplete: false,
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper to redirect to ssyoutube for YouTube videos
  const openSSYouTube = (url: string) => {
    const ssUrl = url
      .replace('youtube.com', 'ssyoutube.com')
      .replace('youtu.be/', 'ssyoutube.com/watch?v=');
    window.open(ssUrl, '_blank');
    toast.info('Abrindo ssyoutube.com para baixar o vídeo...');
  };

  // Check if URL is an HLS manifest
  const isHLSUrl = (url: string): boolean => {
    return url.includes('.m3u8') || url.includes('m3u8');
  };

  // Check if URL is from Colaboraread
  const isColaborareadUrl = (url: string): boolean => {
    return url.includes('colaboraread.com.br');
  };

  // Handle Colaboraread URL - scrape for videos
  const handleColaborareadAnalyze = async (url: string) => {
    setLoadingStatus('Buscando vídeos na página da faculdade...');
    
    const { data, error } = await api.functions.invoke('scrape-colaboraread', {
      body: { url }
    });

    if (error) throw error;

    if (!data.success) {
      throw new Error(data.error || 'Erro ao buscar vídeos');
    }

    if (data.videos && data.videos.length > 0) {
      setColaborareadVideos(data.videos);
      toast.success(`${data.videos.length} vídeo(s) encontrado(s)!`);
    } else {
      throw new Error('Nenhum vídeo encontrado nesta página');
    }
  };

  // Select a video from Colaboraread list
  const handleSelectColaborareadVideo = (video: ColaborareadVideo) => {
    setColaborareadVideos([]);
    setMediaInfo({
      title: video.title,
      thumbnail: '',
      platform: 'Colaboraread',
      author: 'Faculdade',
      embedUrl: video.embedUrl,
      formats: [{
        quality: 'Melhor qualidade',
        format: 'TS',
        url: video.m3u8Url,
        type: 'video'
      }]
    });
    toast.info('Vídeo selecionado! Clique em baixar.');
  };

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setLoadingStatus('Analisando link...');
    setMediaInfo(null);
    setOriginalUrl(url);
    setColaborareadVideos([]);
    resetDownloadState();
    
    try {
      if (isColaborareadUrl(url)) {
        await handleColaborareadAnalyze(url);
        return;
      }

      if (isHLSUrl(url)) {
        setLoadingStatus('Link HLS detectado!');
        setMediaInfo({
          title: 'Vídeo HLS',
          thumbnail: '',
          platform: 'HLS Stream',
          formats: [{
            quality: 'Melhor qualidade',
            format: 'TS',
            url: url,
            type: 'video'
          }]
        });
        toast.success('Link HLS detectado! Clique em baixar.');
        return;
      }

      setLoadingStatus('Buscando informações da mídia...');

      const { data, error } = await api.functions.invoke('analyze-media', {
        body: { url }
      });

      if (error) {
        throw error;
      }

      setLoadingStatus('Processando formatos disponíveis...');

      if (data.success && data.media) {
        setMediaInfo(data.media);
        toast.success('Mídia analisada com sucesso!');
      } else {
        throw new Error(data.error || 'Não foi possível analisar o link');
      }
    } catch (error) {
      console.error('Erro ao analisar:', error);
      toast.error('Erro ao analisar o link. Verifique se o URL é válido.');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  const resetDownloadState = () => {
    setDownloadState({
      isDownloading: false,
      progress: 0,
      blob: null,
      fileName: '',
      fileSize: '',
      isComplete: false,
    });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle HLS download
  const handleHLSDownload = async (m3u8Url: string) => {
    abortControllerRef.current = new AbortController();
    
    const fileName = `video_hls_${Date.now()}.ts`;
    
    setDownloadState({
      isDownloading: true,
      progress: 0,
      blob: null,
      fileName,
      fileSize: 'Processando segmentos...',
      isComplete: false,
    });

    try {
      toast.info('Baixando e combinando segmentos HLS...');
      
      const progressInterval = setInterval(() => {
        setDownloadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 2, 90),
        }));
      }, 500);

      const response = await api.stream('download-hls', { m3u8Url });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao processar HLS');
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar HLS');
      }

      const blob = await response.blob();
      
      setDownloadState({
        isDownloading: false,
        progress: 100,
        blob,
        fileName,
        fileSize: formatBytes(blob.size),
        isComplete: true,
      });

      toast.success('Download HLS concluído! Clique em "Salvar no PC".');

    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        toast.info('Download cancelado');
        resetDownloadState();
        return;
      }
      
      console.error('Erro no download HLS:', error);
      toast.error((error as Error).message || 'Erro ao processar download HLS.');
      resetDownloadState();
    }
  };

  const handleDownload = async (format: MediaInfo['formats'][0]) => {
    if (!mediaInfo) return;

    const isYouTube = mediaInfo.platform.toLowerCase().includes('youtube');

    if (isHLSUrl(format.url)) {
      return handleHLSDownload(format.url);
    }

    abortControllerRef.current = new AbortController();
    
    const extension = format.type === 'audio' ? 'mp3' : format.format.toLowerCase();
    const fileName = `${mediaInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_${format.quality}.${extension}`;
    
    const mimeType = format.type === 'audio' 
      ? 'audio/mpeg' 
      : format.type === 'image'
        ? 'image/jpeg'
        : 'video/mp4';
    
    setDownloadState({
      isDownloading: true,
      progress: 0,
      blob: null,
      fileName,
      fileSize: format.size || '',
      isComplete: false,
    });

    try {
      const invokePromise = api.functions.invoke('download-media', {
        body: { 
          url: format.url,
          quality: format.quality,
          type: format.type,
        },
      });

      let timeoutId: number | undefined;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(
          () => reject(new Error('Tempo esgotado ao gerar o link de download.')),
          20000,
        );
      });

      const { data, error } = (await Promise.race([
        invokePromise,
        timeoutPromise,
      ])) as { data: any; error: any };

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      if (error) throw error;

      if (!data.success || !data.downloadUrl) {
        throw new Error(data.error || 'Erro ao gerar link');
      }

      const finalFileName = data.filename || fileName;

      console.log(`Download URL obtida, isTunnel: ${data.isTunnel}`);

      const response = await api.stream('stream-media', { 
        downloadUrl: data.downloadUrl, 
        mimeType 
      });

      if (!response.ok) {
        if (isYouTube && originalUrl) {
          openSSYouTube(originalUrl);
        } else {
          window.open(data.downloadUrl, '_blank');
          toast.info('Abrindo download em nova aba...');
        }
        resetDownloadState();
        return;
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        if (isYouTube && originalUrl) {
          openSSYouTube(originalUrl);
        } else {
          window.open(data.downloadUrl, '_blank');
          toast.info('Abrindo download em nova aba...');
        }
        resetDownloadState();
        return;
      }

      const contentLength = response.headers.get('Content-Length');
      const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

      if (!response.body) {
        throw new Error('Stream não disponível');
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        const progress = totalSize > 0 
          ? (receivedLength / totalSize) * 100 
          : Math.min(receivedLength / 1000000 * 10, 99);
        
        setDownloadState(prev => ({
          ...prev,
          progress,
          fileSize: formatBytes(receivedLength),
        }));
      }

      const blob = new Blob(chunks as BlobPart[], { type: mimeType });
      
      if (blob.size === 0) {
        console.log('Blob vazio recebido, redirecionando...');
        if (isYouTube && originalUrl) {
          openSSYouTube(originalUrl);
        } else {
          window.open(data.downloadUrl, '_blank');
          toast.info('Arquivo vazio detectado. Abrindo em nova aba...');
        }
        resetDownloadState();
        return;
      }
      
      setDownloadState(prev => ({
        ...prev,
        progress: 100,
        blob,
        fileName: finalFileName,
        fileSize: formatBytes(blob.size),
        isComplete: true,
        isDownloading: false,
      }));

      toast.success('Download concluído! Clique em "Salvar no PC".');

    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        toast.info('Download cancelado');
        resetDownloadState();
        return;
      }
      
      console.error('Erro no download:', error);

      if (isYouTube && originalUrl) {
        openSSYouTube(originalUrl);
      } else {
        const message = (error as Error).message || 'Erro ao processar download.';
        toast.error(message || 'Erro ao processar download. Tente outra qualidade.');
      }

      resetDownloadState();
    }
  };

  const handleCancelDownload = () => {
    abortControllerRef.current?.abort();
    resetDownloadState();
  };

  const handleSaveToPC = () => {
    if (!downloadState.blob) return;
    
    const url = URL.createObjectURL(downloadState.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadState.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Arquivo salvo!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>
      
      <main className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <HeroSection />
        
        <section className="max-w-2xl mx-auto mb-16">
          <UrlInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          {loadingStatus && (
            <p className="text-center text-muted-foreground mt-4 animate-pulse">
              {loadingStatus}
            </p>
          )}
        </section>

        {/* Colaboraread Video List */}
        {colaborareadVideos.length > 0 && (
          <ColaborareadVideoList 
            videos={colaborareadVideos} 
            onSelectVideo={handleSelectColaborareadVideo}
          />
        )}

        {/* Media Preview and Download Options */}
        {mediaInfo && (
          <section className="max-w-4xl mx-auto mb-16 space-y-8 animate-fade-in">
            <MediaPreview media={mediaInfo} />
            
            {downloadState.isDownloading || downloadState.isComplete ? (
              <DownloadProgress 
                progress={downloadState.progress}
                fileName={downloadState.fileName}
                fileSize={downloadState.fileSize}
                isComplete={downloadState.isComplete}
                onCancel={handleCancelDownload}
                onSave={handleSaveToPC}
                onDownloadAnother={resetDownloadState}
              />
            ) : (
              <DownloadOptions 
                formats={mediaInfo.formats} 
                onDownload={handleDownload}
                downloadingFormat={null}
              />
            )}
          </section>
        )}

        <SupportedPlatforms />
        <HowToUse />
        <FAQ />
        
        <CopyrightDisclaimer />
      </main>

      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Index;
