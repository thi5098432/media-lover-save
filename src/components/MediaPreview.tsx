import { useState } from 'react';
import { Play, Clock, User, Video, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

interface MediaPreviewProps {
  media: MediaInfo;
}

const MediaPreview = ({ media }: MediaPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const getPlatformStyle = (platform: string) => {
    const styles: Record<string, { bg: string; icon: string }> = {
      youtube: { bg: 'bg-red-500', icon: '▶' },
      instagram: { bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400', icon: '📷' },
      tiktok: { bg: 'bg-foreground', icon: '♪' },
      twitter: { bg: 'bg-blue-400', icon: '𝕏' },
      facebook: { bg: 'bg-blue-600', icon: 'f' },
      vimeo: { bg: 'bg-cyan-500', icon: '▶' },
      soundcloud: { bg: 'bg-orange-500', icon: '☁' },
    };
    return styles[platform.toLowerCase()] || { bg: 'bg-primary', icon: '▶' };
  };

  const platformStyle = getPlatformStyle(media.platform);
  const videoCount = media.formats.filter(f => f.type === 'video').length;
  const audioCount = media.formats.filter(f => f.type === 'audio').length;

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="bg-card rounded-2xl border border-border overflow-hidden card-glow">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail / Video Player */}
          <div className="relative md:w-80 aspect-video md:aspect-auto md:h-auto bg-secondary overflow-hidden shrink-0">
            {isPlaying && media.embedUrl ? (
              <>
                <iframe
                  src={media.embedUrl}
                  className="w-full h-full min-h-[180px] md:min-h-[200px]"
                  allowFullScreen
                  allow="autoplay; fullscreen; encrypted-media"
                />
                <button
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {media.thumbnail ? (
                  <img 
                    src={media.thumbnail} 
                    alt={media.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full min-h-[180px] md:min-h-[200px] flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                    <Video className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}
                
                {/* Duration badge */}
                {media.duration && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-background/90 backdrop-blur-sm">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-medium">{media.duration}</span>
                  </div>
                )}
                
                {/* Play button overlay */}
                {media.embedUrl ? (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-background/20 hover:bg-background/30 transition-colors cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center animate-pulse-glow">
                      <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </button>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/20 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center animate-pulse-glow">
                      <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              {/* Platform badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-6 h-6 rounded-md ${platformStyle.bg} flex items-center justify-center text-xs text-white font-bold`}>
                  {platformStyle.icon}
                </div>
                <span className="text-sm font-medium text-muted-foreground">{media.platform}</span>
              </div>
              
              {/* Title */}
              <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 mb-2">
                {media.title}
              </h3>
              
              {/* Author */}
              {media.author && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <User className="w-3.5 h-3.5" />
                  <span>{media.author}</span>
                </div>
              )}
            </div>
            
            {/* Format counts */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
              {videoCount > 0 && (
                <Badge variant="secondary" className="gap-1.5">
                  <Video className="w-3 h-3" />
                  {videoCount} vídeo{videoCount > 1 ? 's' : ''}
                </Badge>
              )}
              {audioCount > 0 && (
                <Badge variant="secondary" className="gap-1.5">
                  <span className="text-xs">♪</span>
                  {audioCount} áudio{audioCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPreview;
