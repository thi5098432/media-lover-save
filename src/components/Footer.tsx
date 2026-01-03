import { Link } from 'react-router-dom';
import { Download, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-bold text-lg">MediaDown</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Baixe vídeos, áudios e imagens de suas plataformas favoritas de forma rápida e gratuita.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold font-display mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold font-display mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacidade" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/dmca" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Política DMCA
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="font-semibold font-display mb-4">Aviso Legal</h3>
            <div className="space-y-3 text-muted-foreground text-sm">
              <p>
                Este serviço é uma ferramenta técnica para uso pessoal. Não hospedamos ou distribuímos conteúdo.
              </p>
              <p>
                O usuário é responsável por garantir que possui direitos para baixar o conteúdo. Respeite os direitos autorais.
              </p>
              <p className="text-xs">
                <Link to="/dmca" className="text-primary hover:underline">
                  Reportar violação (DMCA)
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} MediaDown. Todos os direitos reservados.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-destructive" /> no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
