import { Youtube, Instagram, Music2, Twitter, Facebook, Video } from 'lucide-react';

const platforms = [
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'TikTok', icon: Music2, color: 'text-foreground' },
  { name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { name: 'Outros', icon: Video, color: 'text-accent' },
];

const PlatformIcons = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8">
      {platforms.map((platform) => (
        <div 
          key={platform.name}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50"
        >
          <platform.icon className={`w-4 h-4 ${platform.color}`} />
          <span className="text-sm text-muted-foreground">{platform.name}</span>
        </div>
      ))}
    </div>
  );
};

export default PlatformIcons;
