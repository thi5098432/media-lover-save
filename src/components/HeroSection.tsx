import { Download, Zap, Shield } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-sm text-primary font-medium">Rápido e Gratuito</span>
      </div>
      
      <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
        <span className="gradient-text">Baixe Vídeos</span>
        <br />
        <span className="text-foreground">de Qualquer Lugar</span>
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        Cole o link de qualquer plataforma e baixe vídeos, imagens e áudio 
        em alta qualidade, sem perder resolução.
      </p>
      
      <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto">
        Ferramenta para download de conteúdo público e de uso pessoal
      </p>
      
      <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-accent" />
          <span>Alta Qualidade</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span>Super Rápido</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span>100% Seguro</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
