import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, AlertTriangle, BookOpen } from "lucide-react";
import InstallPwaButton from "./InstallPwaButton";

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "¿Cómo comienzo la jornada?",
      answer: "Abre el Día 1 desde el menú de la jornada. Lee atentamente el manuscrito en el lector interactivo de PDF, luego inicia el audio de meditación para sintonizar los armónicos celestiales. Finalmente, registra tu sentir en el Diario Espiritual de abajo y marca el día como completado.",
    },
    {
      question: "¿Necesito completar todo en un solo día?",
      answer: "No. La experiencia del Cofre del Padre Benjamín ha sido organizada deliberadamente para ser realizada a lo largo de siete días consecutivos. Esto permite que cada lección madure y florezca de forma natural en tu mente.",
    },
    {
      question: "¿Mi progreso será guardado?",
      answer: "Sí. Todo tu progreso (días completados, manuscritos favoritos, fecha de ingreso y reflexiones) se graba de manera local y 100% privada en la memoria física de tu navegador (localStorage).",
    },
    {
      question: "¿Puedo usar otro dispositivo?",
      answer: "Como este cofre espiritual prioriza tu privacidad y seguridad absoluta, no requiere crear cuentas ni iniciar sesión con servidores externos. Por ende, los datos de progreso no se sincronizarán de forma automática con otros aparatos.",
    },
    {
      question: "¿Dónde encuentro mi acceso después?",
      answer: "Te recomendamos utilizar el enlace recibido originalmente por correo electrónico. Para mayor comodidad, puedes usar el botón de abajo para instalar el WebApp de forma fija en la pantalla de inicio de tu celular iPhone o Android.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 text-white pb-10">
      
      {/* Title Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-serif font-bold text-gold-400 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-gold-400" />
          Ayuda y Orientación
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Encuentra respuestas a las inquietudes más comunes sobre el uso de tu cofre espiritual.
        </p>
      </div>

      {/* Accordion List of FAQ questions */}
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div 
              id={`faq-item-${index}`}
              key={index}
              className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all duration-200"
            >
              <button
                id={`faq-btn-${index}`}
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-4 py-3.5 flex justify-between items-center hover:bg-slate-800/40 text-slate-100 transition-colors"
              >
                <span className="text-xs font-bold leading-snug pr-4 font-serif">
                  {faq.question}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gold-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/40 bg-slate-950/20">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive PWA Install Section */}
      <div className="bg-slate-900/50 border border-gold-500/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4.5 h-4.5 text-gold-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400">
            Instalar en Pantalla de Inicio
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Para que el cofre funcione igual que una aplicación de celular nativa con carga ultra-rápida y navegación sin navegador, instálalo hoy:
        </p>
        
        <InstallPwaButton />
      </div>

      {/* Warning safety disclaimers */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 flex gap-3 text-[10px] text-slate-500 leading-relaxed">
        <AlertTriangle className="w-4.5 h-4.5 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <strong>Aviso de Contenido:</strong> Este contenido tiene fines educativos, reflexivos y espirituales. No sustituye orientación médica, psicológica, jurídica o financiera profesional. Por favor consulte especialistas autorizados para resolver dudas de salud o finanzas.
        </p>
      </div>

    </div>
  );
}
