import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Zap, Shield, Heart, Scale } from 'lucide-react';
import Footer from '@/components/Footer';
import CopyrightDisclaimer from '@/components/CopyrightDisclaimer';

const Sobre = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">Sobre Nós</h1>
          </div>

          <div className="space-y-8">
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold font-display mb-4">Nossa Missão</h2>
              <div className="text-muted-foreground space-y-3">
                <p>
                  Nascemos da necessidade de ter uma ferramenta simples, rápida e gratuita para baixar 
                  vídeos e outros conteúdos de mídia para uso pessoal offline.
                </p>
                <p>
                  Nossa missão é democratizar o acesso a conteúdo, permitindo que você salve vídeos 
                  educacionais, tutoriais, músicas e outros materiais para assistir quando e onde quiser, 
                  mesmo sem conexão com a internet.
                </p>
              </div>
            </section>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold font-display mb-2">Rápido</h3>
                <p className="text-sm text-muted-foreground">
                  Downloads em alta velocidade com processamento otimizado
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold font-display mb-2">Seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Sem cadastro, sem dados pessoais, sem complicações
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold font-display mb-2">Gratuito</h3>
                <p className="text-sm text-muted-foreground">
                  100% grátis, sem limites de downloads
                </p>
              </div>
            </div>

            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold font-display mb-4">O que Oferecemos</h2>
              <div className="text-muted-foreground space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Múltiplas plataformas:</strong> YouTube, TikTok, Instagram, Twitter, Reddit, Vimeo e muito mais</li>
                  <li><strong>Vários formatos:</strong> Vídeo em diferentes qualidades (1080p, 720p, 480p), áudio MP3 e imagens</li>
                  <li><strong>Sem instalação:</strong> Funciona diretamente no navegador, sem precisar baixar nenhum programa</li>
                  <li><strong>Interface simples:</strong> Cole o link, escolha o formato e baixe. Simples assim!</li>
                  <li><strong>Acompanhamento em tempo real:</strong> Veja o progresso do seu download na página</li>
                </ul>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold font-display mb-4">Nossos Valores</h2>
              <div className="text-muted-foreground space-y-3">
                <p><strong>Privacidade:</strong> Não armazenamos seus vídeos nem seus dados pessoais.</p>
                <p><strong>Simplicidade:</strong> Acreditamos que tecnologia deve ser acessível a todos.</p>
                <p><strong>Respeito:</strong> Incentivamos o uso responsável e legal do nosso serviço.</p>
                <p><strong>Transparência:</strong> Somos claros sobre como nosso serviço funciona.</p>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold font-display mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Responsabilidade Legal
              </h2>
              <div className="text-muted-foreground space-y-3">
                <p>
                  O SaveClip é uma <strong className="text-foreground">ferramenta técnica neutra</strong>, 
                  semelhante a um navegador de internet ou um gerenciador de downloads. Não hospedamos, 
                  armazenamos ou distribuímos qualquer conteúdo.
                </p>
                <p>
                  <strong className="text-foreground">Responsabilidade do Usuário:</strong> O usuário é 
                  integralmente responsável por garantir que possui os direitos necessários para baixar 
                  e utilizar qualquer conteúdo. Incentivamos o uso exclusivamente para:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Backup de seus próprios vídeos e conteúdos</li>
                  <li>Download de conteúdo de domínio público</li>
                  <li>Material sob licença Creative Commons</li>
                  <li>Uso educacional conforme permitido por lei</li>
                </ul>
                <p>
                  Respeitamos os direitos de propriedade intelectual e atendemos prontamente a notificações 
                  DMCA válidas. Saiba mais em nossa{' '}
                  <Link to="/dmca" className="text-primary hover:underline">Política DMCA</Link>.
                </p>
              </div>
            </section>

            <CopyrightDisclaimer variant="full" className="mt-4" />

            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold font-display mb-4">Entre em Contato</h2>
              <p className="text-muted-foreground">
                Tem alguma dúvida, sugestão ou problema? Adoraríamos ouvir você! 
                Visite nossa <Link to="/contato" className="text-primary hover:underline">página de contato</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;
