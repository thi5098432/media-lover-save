import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, Scale, UserCheck } from 'lucide-react';
import Footer from '@/components/Footer';

const Termos = () => {
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
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">Termos de Uso</h1>
          </div>

          <p className="text-muted-foreground mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="space-y-8">
            <section className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold font-display">Aceitação dos Termos</h2>
              </div>
              <div className="text-muted-foreground space-y-3">
                <p>
                  Ao acessar e usar este serviço, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                  Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
                </p>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold font-display mb-4">Descrição do Serviço</h2>
              <div className="text-muted-foreground space-y-3">
                <p>
                  Nosso serviço permite que você baixe conteúdo de mídia de várias plataformas online. 
                  O serviço é fornecido "como está" e destina-se apenas para uso pessoal e privado.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Download de vídeos para uso pessoal offline</li>
                  <li>Extração de áudio de vídeos</li>
                  <li>Download de imagens</li>
                </ul>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border bg-destructive/5">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h2 className="text-xl font-semibold font-display">Uso Permitido e Restrições</h2>
              </div>
              <div className="text-muted-foreground space-y-3">
                <p><strong>Você PODE:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>Baixar conteúdo para visualização pessoal e offline</li>
                  <li>Baixar conteúdo que você possui ou tem permissão para baixar</li>
                  <li>Baixar conteúdo de domínio público ou com licença Creative Commons</li>
                </ul>
                
                <p><strong>Você NÃO PODE:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Redistribuir, revender ou republicar conteúdo baixado</li>
                  <li>Usar o conteúdo para fins comerciais sem autorização</li>
                  <li>Violar direitos autorais ou propriedade intelectual de terceiros</li>
                  <li>Usar o serviço para atividades ilegais</li>
                </ul>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold font-display">Direitos Autorais</h2>
              </div>
              <div className="text-muted-foreground space-y-3">
                <p>
                  <strong>Importante:</strong> Este serviço não hospeda nenhum conteúdo protegido por direitos autorais. 
                  Atuamos apenas como uma ferramenta técnica que facilita o acesso a conteúdo publicamente disponível.
                </p>
                <p>
                  Você é o único responsável por garantir que possui os direitos necessários para baixar e usar 
                  qualquer conteúdo obtido através deste serviço. Respeitamos os direitos de propriedade intelectual 
                  e esperamos que nossos usuários façam o mesmo.
                </p>
                <p>
                  Se você é titular de direitos autorais e acredita que conteúdo está sendo disponibilizado 
                  de forma indevida, entre em contato conosco.
                </p>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold font-display mb-4">Limitação de Responsabilidade</h2>
              <div className="text-muted-foreground space-y-3">
                <p>
                  Na extensão máxima permitida pela lei aplicável, não seremos responsáveis por quaisquer danos 
                  diretos, indiretos, incidentais, especiais, consequenciais ou punitivos resultantes do uso 
                  ou incapacidade de usar o serviço.
                </p>
                <p>
                  Não garantimos que o serviço será ininterrupto, seguro ou livre de erros. O uso do serviço 
                  é por sua conta e risco.
                </p>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold font-display mb-4">Modificações dos Termos</h2>
              <div className="text-muted-foreground space-y-3">
                <p>
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão 
                  em vigor imediatamente após a publicação dos termos revisados. O uso continuado do serviço 
                  após quaisquer alterações constitui aceitação dos novos termos.
                </p>
              </div>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold font-display mb-4">Contato</h2>
              <p className="text-muted-foreground">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através da nossa{' '}
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

export default Termos;
