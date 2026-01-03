import { Download, Video, Music, Image, Loader2, Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface DownloadFormat {
  quality: string;
  format: string;
  size?: string;
  url: string;
  type: 'video' | 'audio' | 'image';
}

interface DownloadOptionsProps {
  formats: DownloadFormat[];
  onDownload: (format: DownloadFormat) => void;
  downloadingFormat: string | null;
}

const DownloadOptions = ({ formats, onDownload, downloadingFormat }: DownloadOptionsProps) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  const videoFormats = formats.filter(f => f.type === 'video');
  const audioFormats = formats.filter(f => f.type === 'audio');
  const imageFormats = formats.filter(f => f.type === 'image');

  // Separate HD and SD videos
  const hdFormats = videoFormats.filter(f => {
    const quality = f.quality.toLowerCase();
    return quality.includes('1080') || quality.includes('720') || quality.includes('hd') || quality.includes('4k');
  });
  const sdFormats = videoFormats.filter(f => !hdFormats.includes(f));

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Music;
      case 'image': return Image;
      default: return Download;
    }
  };

  const getQualityBadgeStyle = (quality: string) => {
    const q = quality.toLowerCase();
    if (q.includes('4k') || q.includes('2160')) {
      return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30';
    }
    if (q.includes('1080') || q.includes('hd')) {
      return 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30';
    }
    if (q.includes('720')) {
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
    return 'bg-secondary text-muted-foreground border-border';
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success('Link copiado!');
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      toast.error('Erro ao copiar link');
    }
  };

  const renderFormatCard = (format: DownloadFormat, index: number, isRecommended: boolean = false) => {
    const formatKey = `${format.quality}-${format.type}`;
    const isDownloading = downloadingFormat === formatKey;
    const isCopied = copiedUrl === format.url;
    const Icon = getIcon(format.type);
    
    return (
      <div 
        key={index}
        className={`relative flex items-center justify-between p-4 rounded-xl bg-secondary/30 border transition-all duration-200 hover:bg-secondary/50 ${
          isRecommended ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border/50 hover:border-primary/30'
        }`}
      >
        {isRecommended && (
          <div className="absolute -top-2.5 left-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-medium text-primary-foreground">
            <Sparkles className="w-3 h-3" />
            Recomendado
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className={`px-2.5 py-1 rounded-md text-sm font-semibold border ${getQualityBadgeStyle(format.quality)}`}>
              {format.quality}
            </span>
            <span className="text-muted-foreground text-sm uppercase tracking-wide">{format.format}</span>
            {format.size && (
              <span className="text-muted-foreground/70 text-sm">~{format.size}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="icon"
            variant="ghost"
            onClick={() => handleCopyLink(format.url)}
            className="text-muted-foreground hover:text-foreground"
            title="Copiar link"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <Button 
            size="sm"
            onClick={() => onDownload(format)}
            disabled={isDownloading}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 min-w-[100px]"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                <span className="hidden sm:inline">Baixando</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-1.5" />
                Baixar
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderFormatSection = (title: string, items: DownloadFormat[], type: string, showRecommended: boolean = false) => {
    if (items.length === 0) return null;
    
    const Icon = getIcon(type);
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <h4 className="font-display font-semibold text-foreground">{title}</h4>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {items.length} {items.length === 1 ? 'opção' : 'opções'}
          </span>
        </div>
        <div className="grid gap-2">
          {items.map((format, index) => renderFormatCard(format, index, showRecommended && index === 0))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Opções de Download
          </h3>
          <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
            {formats.length} formatos disponíveis
          </span>
        </div>
        
        {renderFormatSection('Vídeo HD', hdFormats, 'video', true)}
        {renderFormatSection('Vídeo SD', sdFormats, 'video')}
        {renderFormatSection('Áudio', audioFormats, 'audio')}
        {renderFormatSection('Imagem', imageFormats, 'image')}
      </div>
    </div>
  );
};

export default DownloadOptions;
