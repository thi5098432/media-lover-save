import { Play, GraduationCap, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ColaborareadVideo {
  id: string;
  title: string;
  m3u8Url: string;
  embedUrl: string;
}

interface ColaborareadVideoListProps {
  videos: ColaborareadVideo[];
  onSelectVideo: (video: ColaborareadVideo) => void;
}

const ColaborareadVideoList = ({ videos, onSelectVideo }: ColaborareadVideoListProps) => {
  return (
    <div className="max-w-3xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Vídeos Encontrados
            </h3>
            <p className="text-sm text-muted-foreground">
              {videos.length} vídeo{videos.length > 1 ? 's' : ''} da faculdade
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{video.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Video className="w-3 h-3" />
                    MediaStream
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => onSelectVideo(video)}
                className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Play className="w-4 h-4" />
                Selecionar
              </Button>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Selecione um vídeo para baixar
        </p>
      </Card>
    </div>
  );
};

export default ColaborareadVideoList;
