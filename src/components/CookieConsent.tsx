import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
            <Cookie className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              🍪 Usamos cookies
            </h3>
            <p className="text-sm text-muted-foreground">
              Este site utiliza cookies para melhorar sua experiência, analisar tráfego e exibir anúncios personalizados. 
              Ao continuar navegando, você concorda com nossa{" "}
              <a 
                href="/privacidade" 
                className="text-primary hover:underline"
              >
                Política de Privacidade
              </a>.
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="flex-1 sm:flex-none"
            >
              Recusar
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
            >
              Aceitar
            </Button>
          </div>
          
          <button
            onClick={handleDecline}
            className="absolute top-2 right-2 sm:hidden p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
