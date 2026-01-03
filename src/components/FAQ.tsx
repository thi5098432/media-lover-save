import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "O serviço é gratuito?",
    answer: "Sim! O SaveClip é 100% gratuito para uso pessoal. Não cobramos nada para baixar vídeos, áudios ou imagens das redes sociais."
  },
  {
    question: "Quais plataformas são suportadas?",
    answer: "Suportamos YouTube, TikTok, Instagram, Twitter/X, Facebook, Reddit, Vimeo, SoundCloud, Pinterest, Twitch e muitas outras plataformas populares."
  },
  {
    question: "É legal baixar vídeos?",
    answer: "O download de conteúdo para uso pessoal geralmente é permitido pela legislação brasileira para fins de backup ou acesso offline. No entanto, redistribuir, vender ou usar comercialmente conteúdo protegido por direitos autorais sem permissão é ilegal. Sempre respeite os direitos dos criadores e verifique a licença do conteúdo."
  },
  {
    question: "Este serviço viola direitos autorais?",
    answer: "Não. O SaveClip é uma ferramenta técnica neutra, semelhante a um navegador de internet. Não hospedamos, armazenamos ou distribuímos qualquer conteúdo. A responsabilidade pelo uso adequado é inteiramente do usuário, que deve garantir ter direitos para baixar o material."
  },
  {
    question: "Posso baixar qualquer vídeo?",
    answer: "Tecnicamente, a ferramenta permite baixar conteúdo de diversas plataformas. No entanto, você só deve baixar conteúdo de domínio público, Creative Commons, seu próprio conteúdo, ou material para o qual você tem autorização expressa. Baixar conteúdo protegido sem permissão pode violar leis de direitos autorais."
  },
  {
    question: "O que acontece se eu baixar conteúdo protegido?",
    answer: "A responsabilidade é inteiramente do usuário. O SaveClip não monitora ou controla o conteúdo baixado. Se você baixar material protegido sem autorização, poderá estar sujeito às penalidades previstas na Lei de Direitos Autorais (Lei 9.610/98). Recomendamos sempre verificar a licença do conteúdo antes de baixar."
  },
  {
    question: "Qual a qualidade máxima disponível?",
    answer: "Oferecemos downloads em várias qualidades, incluindo HD (1080p), Full HD e até 4K quando disponível na plataforma de origem. Você pode escolher a qualidade que preferir."
  },
  {
    question: "Preciso instalar algum programa?",
    answer: "Não! O SaveClip funciona 100% no navegador. Não é necessário instalar extensões, plugins ou programas no seu computador ou celular."
  },
  {
    question: "Posso baixar apenas o áudio de um vídeo?",
    answer: "Sim! Oferecemos a opção de extrair apenas o áudio em formato MP3, perfeito para músicas, podcasts e outros conteúdos de áudio."
  },
  {
    question: "O download é seguro?",
    answer: "Absolutamente! Não armazenamos seus dados ou os vídeos baixados. Todo o processamento é feito de forma segura e sua privacidade é nossa prioridade."
  },
  {
    question: "Por que alguns downloads falham?",
    answer: "Alguns vídeos podem estar protegidos ou restritos pela plataforma. Também pode haver instabilidade temporária nos servidores. Tente novamente em alguns minutos ou verifique se o link está correto."
  },
  {
    question: "Como reportar violação de direitos autorais?",
    answer: "Se você é titular de direitos autorais e acredita que seu conteúdo está sendo usado indevidamente, entre em contato através da nossa página de Política DMCA. Respondemos a todas as notificações válidas em até 48 horas."
  }
];

const FAQ = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground">
            Tire suas dúvidas sobre o SaveClip
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card/50 border border-border/50 rounded-xl px-6 data-[state=open]:bg-card/80 transition-colors"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Ainda tem dúvidas?{" "}
            <a href="/contato" className="text-primary hover:underline">
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
