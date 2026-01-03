import { useState } from 'react';
import { Search, Link2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  loadingStatus?: string;
}

const UrlInput = ({ onAnalyze, isLoading, loadingStatus }: UrlInputProps) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      }
    } catch {
      // Clipboard access denied
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="relative gradient-border rounded-2xl p-[1px]">
          <div className="flex items-center gap-3 bg-card rounded-2xl p-2 pr-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Cole o link do vídeo aqui..."
              className="flex-1 border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePaste}
              className="text-muted-foreground hover:text-foreground"
            >
              Colar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !url.trim()}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analisar
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
      
      {/* Loading Status */}
      {isLoading && loadingStatus && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-in fade-in">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span>{loadingStatus}</span>
        </div>
      )}
      
      {/* Helper text */}
      {!isLoading && (
        <p className="text-center text-sm text-muted-foreground">
          Suporta: YouTube, Instagram, TikTok, Twitter, Facebook, Vimeo, SoundCloud e mais
        </p>
      )}
    </div>
  );
};

export default UrlInput;
