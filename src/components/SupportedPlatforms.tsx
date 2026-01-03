import { 
  Youtube, 
  Instagram, 
  Twitter, 
  Facebook,
  Music2,
  Film,
  Image,
  MessageCircle
} from 'lucide-react';

const platforms = [
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'TikTok', icon: MessageCircle, color: 'text-foreground' },
  { name: 'Twitter/X', icon: Twitter, color: 'text-blue-400' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { name: 'Vimeo', icon: Film, color: 'text-cyan-400' },
  { name: 'SoundCloud', icon: Music2, color: 'text-orange-500' },
  { name: 'Pinterest', icon: Image, color: 'text-red-600' },
];

const SupportedPlatforms = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <div className="text-center mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Plataformas Suportadas
        </h3>
        <p className="text-sm text-muted-foreground">
          Baixe de qualquer uma dessas plataformas gratuitamente
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/30 hover:bg-secondary transition-all duration-200 cursor-default"
          >
            <platform.icon className={`w-4 h-4 ${platform.color}`} />
            <span className="text-sm font-medium text-foreground">{platform.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportedPlatforms;
