import React from "react";
import { Sparkles, HelpCircle } from "lucide-react";

interface ProgressBarProps {
  completedCount: number;
}

export default function ProgressBar({ completedCount }: ProgressBarProps) {
  const percent = Math.round((completedCount / 7) * 100);

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
      
      {/* Top metrics label */}
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-slate-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          Tu Progreso de Transformación
        </span>
        <span className="font-mono font-bold text-gold-400">
          {completedCount} de 7 días completados ({percent}%)
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(207,162,83,0.3)]"
          style={{ width: `${Math.max(percent, 4)}%` }}
        />
      </div>

      {/* Recommended order instruction tip */}
      <div className="flex items-start gap-1.5 pt-1 text-[10px] text-slate-400">
        <HelpCircle className="w-3.5 h-3.5 text-gold-400/80 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Para vivir la experiencia completa recomendamos seguir los días en orden. Cada día desbloquea un aspecto clave de tu renovación personal.
        </p>
      </div>

    </div>
  );
}
