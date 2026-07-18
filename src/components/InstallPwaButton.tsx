import React, { useState, useEffect } from "react";
import { Download, Share2, Smartphone, PlusSquare, HelpCircle, X, Check } from "lucide-react";

export default function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Track PWA install state
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if already in standalone mode (installed PWA)
    if (
      (window.navigator as any).standalone ||
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (installed) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3 text-xs text-emerald-300">
        <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
        <span>¡El Cofre ya está instalado en tu pantalla de inicio!</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Android/Chrome prompt */}
      {isInstallable && (
        <button
          id="btn-install-pwa"
          onClick={handleInstallClick}
          className="w-full bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 hover:from-gold-600 hover:to-gold-700 text-black font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-95 uppercase tracking-wider"
        >
          <Download className="w-4 h-4" />
          Instalar El Cofre en mi Celular
        </button>
      )}

      {/* iOS Safari Trigger Button */}
      {isIos && !showIosTip && (
        <button
          id="btn-trigger-ios-install-tip"
          onClick={() => setShowIosTip(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-gold-500/30 text-gold-300 font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm uppercase tracking-wider"
        >
          <Smartphone className="w-4 h-4 text-gold-400" />
          ¿Cómo instalar en mi iPhone?
        </button>
      )}

      {/* iOS Detailed Safari Instructions Popover */}
      {showIosTip && (
        <div className="bg-slate-950/90 border border-gold-500/40 rounded-2xl p-4 space-y-3 relative animate-[fadeIn_0.2s_ease-out]">
          <button
            id="btn-close-ios-tip"
            onClick={() => setShowIosTip(false)}
            className="absolute top-3 right-3 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wide flex items-center gap-1.5 pr-6">
            <Smartphone className="w-4 h-4" />
            Instalación en iPhone / iPad
          </h4>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Apple requiere que agregues el sitio web manualmente usando el navegador Safari:
          </p>

          <ol className="space-y-2.5 text-[11px] text-slate-200 pl-1.5">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">1</span>
              <span>Abre esta jornada usando el navegador <strong>Safari</strong> de tu iPhone.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">2</span>
              <span className="flex items-center gap-1 flex-wrap">
                Presiona el botón de <strong>Compartir</strong>
                <Share2 className="w-3.5 h-3.5 text-blue-400 inline" />
                (el icono de cuadro con flecha arriba en la barra inferior).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">3</span>
              <span className="flex items-center gap-1 flex-wrap">
                Desplázate hacia abajo y selecciona <strong>Añadir a pantalla de inicio</strong>
                <PlusSquare className="w-3.5 h-3.5 text-gold-400 inline" />.
              </span>
            </li>
          </ol>

          <div className="pt-1.5 border-t border-gold-500/10 flex justify-between items-center">
            <span className="text-[9px] text-gold-400/70 italic">Disfruta de la experiencia como app nativa</span>
            <button
              id="btn-understand-ios-tip"
              onClick={() => setShowIosTip(false)}
              className="text-[10px] font-bold text-gold-400 hover:underline"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Standard Desktop/Offline installation help */}
      {!isInstallable && !isIos && (
        <p className="text-[10px] text-slate-400 text-center leading-relaxed italic bg-slate-900/45 border border-slate-800/60 p-2 rounded-lg">
          Para instalar este cofre espiritual en tu computadora, haz clic en el icono de instalación <strong>(+)</strong> ubicado en la barra de direcciones de Chrome, Edge o tu navegador preferido.
        </p>
      )}
    </div>
  );
}
