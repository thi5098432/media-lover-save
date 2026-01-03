import { Copy, Search, Download, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Copy,
    title: 'Copie o link',
    description: 'Copie o URL do vídeo da plataforma'
  },
  {
    icon: Search,
    title: 'Cole e analise',
    description: 'Cole o link e clique em Analisar'
  },
  {
    icon: Download,
    title: 'Escolha a qualidade',
    description: 'Selecione o formato desejado'
  },
  {
    icon: CheckCircle,
    title: 'Baixe',
    description: 'Salve o arquivo no seu PC'
  }
];

const HowToUse = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-16">
      <div className="text-center mb-8">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Como usar?
        </h3>
        <p className="text-sm text-muted-foreground">
          Baixe seus vídeos favoritos em 4 passos simples
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative flex flex-col items-center text-center p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="absolute -top-3 left-4 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
              {index + 1}
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-display font-semibold text-foreground text-sm mb-1">
              {step.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToUse;
