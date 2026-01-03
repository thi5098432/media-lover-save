import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Cookie } from 'lucide-react';
import Footer from '@/components/Footer';

const Privacidade = () => {
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
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">Política de Privacidade</h1>
          </div>

          <p className="text-muted-foreground mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="space-y-8">
            <section className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold font-display">Informações que Coletamos</h2>
              </div>
              <div className="text-muted-foreground space-y-3">
                <p>
                  Nosso serviço foi projetado com sua privacidade em mente. Coletamos apenas informações mínimas necessárias para fornecer nossos serviços:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>URLs fornecidas:</strong> Os links que você cola são processados temporariamente para análise e download.</li>
                  <li><strong>Dados de uso:</strong> Informações anônimas sobre como você usa o site (páginas visitadas, tempo de permanência).</li>
                  <li><strong>Cookies técnicos:</strong> Pequenos arquivos que melhoram sua experiência de navegação.</li>
                </ul>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold font-display">Como Usamos suas Informações</h2>
              </div>
              <div className="text-muted-foreground space-y-3">
                <p>Utilizamos as informações coletadas para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Processar suas solicitações de download</li>
                  <li>Melhorar nossos serviços e experiência do usuário</li>
                  <li>Analisar padrões de uso de forma agregada e anônima</li>
                  <li>Exibir anúncios relevantes (quando aplicável)</li>
                </ul>
                <p className="mt-4">
                  <strong>Importante:</strong> Não armazenamos os vídeos ou arquivos baixados. Todo o processamento é feito em tempo real e os dados são descartados após a conclusão.
                </p>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold font-display">Cookies e Publicidade</h2>
              </div>
              <div className="text-muted-foreground space-y-3">
                <p>Utilizamos cookies para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento do site</li>
                  <li><strong>Cookies de análise:</strong> Google Analytics para entender como o site é usado</li>
                  <li><strong>Cookies de publicidade:</strong> Para exibir anúncios relevantes através do Google AdSense</li>
                </ul>
                <p className="mt-4">
                  Você pode gerenciar suas preferências de cookies a qualquer momento através das configurações do seu navegador.
                </p>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold font-display mb-4">Seus Direitos (LGPD)</h2>
              <div className="text-muted-foreground space-y-3">
                <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos ou desatualizados</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Revogar o consentimento a qualquer momento</li>
                  <li>Obter informações sobre o compartilhamento de dados</li>
                </ul>
                <p className="mt-4">
                  Para exercer qualquer um desses direitos, entre em contato conosco através da nossa <Link to="/contato" className="text-primary hover:underline">página de contato</Link>.
                </p>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold font-display mb-4">Contato</h2>
              <p className="text-muted-foreground">
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através da nossa{' '}
                <Link to="/contato" className="text-primary hover:underline">página de contato</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacidade;
