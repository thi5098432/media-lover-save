import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, AlertTriangle, FileText, Clock } from 'lucide-react';
import Footer from '@/components/Footer';

const DMCA = () => {
  return (
    <>
      <Helmet>
        <title>Política DMCA - SaveClip</title>
        <meta name="description" content="Política DMCA do SaveClip. Saiba como reportar violações de direitos autorais e nosso compromisso com a propriedade intelectual." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://saveclip.com.br/dmca" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <main className="relative z-10 flex-1 container mx-auto px-4 py-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>

          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-primary/10">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Política DMCA
                </h1>
                <p className="text-muted-foreground mt-1">
                  Digital Millennium Copyright Act
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Introdução */}
              <section className="bg-card/50 border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  O que é DMCA?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  O Digital Millennium Copyright Act (DMCA) é uma lei de direitos autorais dos Estados Unidos 
                  que protege a propriedade intelectual online. Embora o SaveClip opere no Brasil, respeitamos 
                  os princípios do DMCA e da Lei de Direitos Autorais brasileira (Lei 9.610/98), atendendo 
                  prontamente a notificações válidas de violação de direitos autorais.
                </p>
              </section>

              {/* Nosso Compromisso */}
              <section className="bg-card/50 border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Nosso Compromisso
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    O SaveClip é uma ferramenta técnica que facilita downloads de mídia. 
                    <strong className="text-foreground"> Não hospedamos, armazenamos ou distribuímos qualquer conteúdo protegido por direitos autorais.</strong>
                  </p>
                  <p>
                    Atuamos como um intermediário técnico e respeitamos integralmente os direitos de 
                    propriedade intelectual. Nos comprometemos a:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Responder a todas as notificações DMCA válidas dentro de 48 horas</li>
                    <li>Cooperar com titulares de direitos autorais</li>
                    <li>Tomar medidas apropriadas contra infratores reincidentes</li>
                    <li>Manter transparência em nossos processos</li>
                  </ul>
                </div>
              </section>

              {/* Como Reportar */}
              <section className="bg-accent/5 border border-accent/20 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                  Como Reportar uma Violação
                </h2>
                <p className="text-muted-foreground mb-4">
                  Se você é titular de direitos autorais e acredita que seu conteúdo está sendo 
                  utilizado indevidamente através de nossa ferramenta, envie uma notificação DMCA 
                  contendo as seguintes informações:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-2">
                  <li>
                    <strong className="text-foreground">Identificação do conteúdo:</strong> Descrição clara do 
                    material protegido por direitos autorais que você alega ter sido violado.
                  </li>
                  <li>
                    <strong className="text-foreground">URL do conteúdo original:</strong> Link para o conteúdo 
                    original que você possui os direitos.
                  </li>
                  <li>
                    <strong className="text-foreground">Seus dados de contato:</strong> Nome completo, endereço, 
                    telefone e e-mail para que possamos entrar em contato.
                  </li>
                  <li>
                    <strong className="text-foreground">Declaração de boa-fé:</strong> Uma declaração de que você 
                    acredita de boa-fé que o uso do material não é autorizado pelo proprietário dos direitos 
                    autorais, seu agente ou a lei.
                  </li>
                  <li>
                    <strong className="text-foreground">Declaração de veracidade:</strong> Uma declaração, sob pena 
                    de perjúrio, de que as informações na notificação são precisas e que você é o proprietário 
                    dos direitos autorais ou está autorizado a agir em nome do proprietário.
                  </li>
                  <li>
                    <strong className="text-foreground">Assinatura:</strong> Sua assinatura física ou eletrônica.
                  </li>
                </ol>
              </section>

              {/* Contato */}
              <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Enviar Notificação DMCA
                </h2>
                <p className="text-muted-foreground mb-4">
                  Envie sua notificação DMCA para o seguinte endereço de e-mail:
                </p>
                <a 
                  href="mailto:dmca@saveclip.com.br" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary font-medium hover:bg-primary/20 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  dmca@saveclip.com.br
                </a>
                <p className="text-sm text-muted-foreground mt-4">
                  Alternativamente, você pode usar nosso{' '}
                  <Link to="/contato" className="text-primary hover:underline">
                    formulário de contato
                  </Link>{' '}
                  selecionando o assunto "Direitos Autorais / DMCA".
                </p>
              </section>

              {/* Tempo de Resposta */}
              <section className="bg-card/50 border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Tempo de Resposta
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Nos comprometemos a analisar e responder a todas as notificações DMCA válidas 
                    dentro de <strong className="text-foreground">48 horas úteis</strong>.
                  </p>
                  <p>
                    Após receber uma notificação válida, tomaremos as seguintes medidas:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Confirmação de recebimento da notificação</li>
                    <li>Análise da reclamação e verificação da validade</li>
                    <li>Implementação de medidas técnicas apropriadas, se aplicável</li>
                    <li>Notificação ao reclamante sobre as ações tomadas</li>
                  </ul>
                </div>
              </section>

              {/* Aviso Legal */}
              <section className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Aviso Importante
                </h2>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Notificações DMCA falsas ou de má-fé são ilegais.</strong> Se 
                  você fizer uma declaração falsa de que um material está infringindo seus direitos autorais, 
                  poderá ser responsabilizado por danos, incluindo custos e honorários advocatícios. Certifique-se 
                  de que você é realmente o titular dos direitos antes de enviar uma notificação.
                </p>
              </section>

              {/* Links Relacionados */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  to="/termos" 
                  className="text-sm text-primary hover:underline"
                >
                  Termos de Uso →
                </Link>
                <Link 
                  to="/privacidade" 
                  className="text-sm text-primary hover:underline"
                >
                  Política de Privacidade →
                </Link>
                <Link 
                  to="/contato" 
                  className="text-sm text-primary hover:underline"
                >
                  Contato →
                </Link>
              </div>

              <p className="text-sm text-muted-foreground pt-4">
                Última atualização: {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DMCA;
