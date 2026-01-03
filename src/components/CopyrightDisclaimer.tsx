import { AlertTriangle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CopyrightDisclaimerProps {
  variant?: 'compact' | 'banner' | 'full';
  className?: string;
}

const CopyrightDisclaimer = ({ variant = 'compact', className = '' }: CopyrightDisclaimerProps) => {
  if (variant === 'banner') {
    return (
      <div className={`bg-accent/10 border border-accent/20 rounded-xl p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Aviso Importante sobre Direitos Autorais
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Este serviço destina-se exclusivamente ao download de conteúdo de domínio público, 
              Creative Commons, ou material que você possui direitos de uso. Baixar e redistribuir 
              conteúdo protegido por direitos autorais sem autorização é ilegal. O usuário é 
              integralmente responsável pelo uso que faz desta ferramenta.
            </p>
            <div className="flex gap-4 text-xs">
              <Link to="/termos" className="text-primary hover:underline">
                Termos de Uso
              </Link>
              <Link to="/dmca" className="text-primary hover:underline">
                Política DMCA
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`bg-card/50 border border-border rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/10">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground">Compromisso com Direitos Autorais</h3>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            O SaveClip é uma ferramenta técnica que facilita o download de mídia da internet. 
            <strong className="text-foreground"> Não hospedamos, armazenamos ou distribuímos qualquer conteúdo.</strong>
          </p>
          <p>
            Este serviço foi desenvolvido para uso pessoal e educacional legítimo, como:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Backup de seus próprios vídeos</li>
            <li>Download de conteúdo de domínio público</li>
            <li>Acesso offline a material Creative Commons</li>
            <li>Uso educacional conforme permitido por lei</li>
          </ul>
          <p>
            <strong className="text-foreground">Responsabilidade do Usuário:</strong> Você é integralmente 
            responsável por garantir que possui os direitos necessários para baixar e utilizar qualquer 
            conteúdo. O uso indevido desta ferramenta para infringir direitos autorais é estritamente proibido.
          </p>
          <p>
            Respeitamos os direitos de propriedade intelectual e atendemos prontamente a notificações 
            DMCA válidas. Saiba mais em nossa{' '}
            <Link to="/dmca" className="text-primary hover:underline">
              Política DMCA
            </Link>.
          </p>
        </div>
      </div>
    );
  }

  // Compact variant (default)
  return (
    <p className={`text-xs text-muted-foreground ${className}`}>
      <Shield className="w-3 h-3 inline mr-1" />
      Ferramenta para uso pessoal. O usuário é responsável pelo conteúdo baixado.{' '}
      <Link to="/termos" className="text-primary hover:underline">
        Termos
      </Link>
      {' · '}
      <Link to="/dmca" className="text-primary hover:underline">
        DMCA
      </Link>
    </p>
  );
};

export default CopyrightDisclaimer;
