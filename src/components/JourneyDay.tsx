import React, { useState, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, AlertCircle, FileText, Music, Bookmark, Calendar, Check } from "lucide-react";
import { DayContent } from "../types";
import PdfViewer from "./PdfViewer";
import VturbAudioEmbed from "./VturbAudioEmbed";

interface JourneyDayProps {
  dayContent: DayContent;
  isCompleted: boolean;
  onToggleCompletion: () => void;
  isFavorite: (itemId: string) => boolean;
  onToggleFavorite: (item: { id: string; dayId: number; type: "day" | "reflection" | "manuscript" | "audio"; title: string }) => void;
  journalText: string;
  onSaveJournal: (text: string) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  isLocked?: boolean;
  remainingTime?: string;
}

export default function JourneyDay({
  dayContent,
  isCompleted,
  onToggleCompletion,
  isFavorite,
  onToggleFavorite,
  journalText,
  onSaveJournal,
  onPrevDay,
  onNextDay,
  isLocked = false,
  remainingTime = "",
}: JourneyDayProps) {
  const [inputText, setInputText] = useState(journalText);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Sync state if dayContent changes or journalText updates externally
  useEffect(() => {
    setInputText(journalText);
  }, [dayContent.dayId, journalText]);

  // Debounce saving or handle auto-saving on change
  useEffect(() => {
    if (inputText === journalText) return;

    setSaveStatus("saving");
    const timer = setTimeout(() => {
      onSaveJournal(inputText);
      setSaveStatus("saved");
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputText]);

  const handleManualSave = () => {
    onSaveJournal(inputText);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const dayFavId = `day-${dayContent.dayId}`;
  const pdfFavId = `manuscript-${dayContent.dayId}`;
  const audioFavId = `audio-${dayContent.dayId}`;
  const refFavId = `reflection-${dayContent.dayId}`;

  if (isLocked) {
    return (
      <div className="space-y-6 text-white pb-14 animate-[fadeIn_0.3s_ease-out]">
        {/* Top Banner Navigation & Header */}
        <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
          <button
            id="btn-day-prev"
            onClick={onPrevDay}
            className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-1 text-xs"
          >
            <ChevronLeft className="w-4 h-4 text-gold-400" />
            <span>Día Anterior</span>
          </button>

          <div className="text-center">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-mono">
              Día {dayContent.dayId} Bloqueado
            </span>
            <h2 className="text-sm font-serif font-bold text-slate-400 mt-1">
              Contenido Restringido
            </h2>
          </div>

          <button
            id="btn-day-next"
            onClick={onNextDay}
            className="p-1.5 opacity-40 cursor-not-allowed rounded-xl text-slate-600 transition-all flex items-center gap-1 text-xs"
            disabled
          >
            <span>Día Siguiente</span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Locked Page Content */}
        <div className="bg-gradient-to-b from-[#0a0f1d] to-[#04060c] border border-gold-500/15 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden">
          {/* Subtle background holy mark */}
          <div className="absolute inset-0 flex items-center justify-center text-gold-500/3 select-none font-serif text-[180px] pointer-events-none">
            ☨
          </div>

          <div className="relative z-10 max-w-md mx-auto space-y-4">
            <div className="mx-auto w-20 h-20 bg-amber-500/5 border border-amber-500/20 rounded-full flex items-center justify-center text-gold-400 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 animate-pulse text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-serif font-extrabold text-slate-100">
                La Regla de las 24 Horas
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Para asimilar plenamente el conocimiento sagrado y la oración guiada de cada manuscrito, es necesario esperar <span className="text-gold-400 font-bold">24 horas de reposo</span> desde que accediste al día anterior.
              </p>
              <p className="text-[11px] text-slate-500 italic">
                « Guarda silencio ante el Señor, y espera en él con paciencia. » — Salmos 37:7
              </p>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-4 border border-gold-500/10 font-mono text-sm space-y-1">
              <div className="text-[10px] uppercase text-slate-500 tracking-wider">Próximo Manuscrito</div>
              <div className="text-gold-400 font-extrabold text-base tracking-wide">{remainingTime || "Bloqueado"}</div>
            </div>

            <div className="pt-2">
              <button
                id="btn-locked-page-go-prev"
                onClick={onPrevDay}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4 text-gold-400" />
                Volver al Día {dayContent.dayId - 1} (Desbloqueado)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white pb-14 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Top Banner Navigation & Header */}
      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <button
          id="btn-day-prev"
          onClick={onPrevDay}
          className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-1 text-xs"
        >
          <ChevronLeft className="w-4 h-4 text-gold-400" />
          <span className="hidden sm:inline">Día Anterior</span>
        </button>

        <div className="text-center">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-gold-400 bg-gold-500/10 px-2.5 py-0.5 rounded-full border border-gold-500/20 font-mono">
            Estás en el Día {dayContent.dayId}
          </span>
          <h2 className="text-sm font-serif font-bold text-slate-200 mt-1">
            {dayContent.theme}
          </h2>
        </div>

        <button
          id="btn-day-next"
          onClick={onNextDay}
          className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-1 text-xs"
        >
          <span className="hidden sm:inline">Día Siguiente</span>
          <ChevronRight className="w-4 h-4 text-gold-400" />
        </button>
      </div>

      {/* Main Devotional Presentation */}
      <div className="bg-gradient-to-b from-slate-900/60 to-slate-950/20 border border-slate-800 rounded-3xl p-5 lg:p-7 space-y-5 relative overflow-hidden">
        
        {/* Subtle background holy mark */}
        <div className="absolute top-4 right-4 text-gold-500/5 select-none font-serif text-8xl pointer-events-none">
          ☨
        </div>

        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1">
            <h3 className="text-lg lg:text-xl font-serif font-extrabold text-slate-100">
              {dayContent.title}
            </h3>
            <p className="text-[11px] font-medium text-gold-400 tracking-wide font-serif italic">
              « {dayContent.verse} » — {dayContent.verseReference}
            </p>
          </div>

          {/* Favoriting a complete day */}
          <button
            id={`btn-toggle-favorite-day-${dayContent.dayId}`}
            onClick={() => onToggleFavorite({
              id: dayFavId,
              dayId: dayContent.dayId,
              type: "day",
              title: `Día ${dayContent.dayId}: ${dayContent.theme}`
            })}
            className={`p-2.5 rounded-full transition-all ${
              isFavorite(dayFavId)
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Guardar Día completo"
          >
            <Heart className={`w-4.5 h-4.5 ${isFavorite(dayFavId) ? "fill-gold-400" : ""}`} />
          </button>
        </div>

        {/* Intro narrative paragraph */}
        <p className="text-xs text-slate-300 leading-relaxed font-serif">
          {dayContent.intro}
        </p>

        {/* Highlight Quote Grid with completion toggle */}
        <div className="pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id={`btn-toggle-completion-${dayContent.dayId}`}
              onClick={onToggleCompletion}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isCompleted
                  ? "bg-emerald-500 text-black shadow-[0_2px_10px_rgba(16,185,129,0.2)]"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {isCompleted ? "Día Completado" : "Marcar Día como Completado"}
            </button>
          </div>

          <div className="text-[10px] text-slate-500 italic">
            Recomendamos escuchar el audio completo y escribir tu sentir para marcarlo.
          </div>
        </div>
      </div>

      {/* BLOCK 1: AUDIO MEDITATION CONTAINER */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-gold-400" />
            1. Audio de Meditación Guiada (Vturb)
          </span>

          <button
            id={`btn-fav-audio-${dayContent.dayId}`}
            onClick={() => onToggleFavorite({
              id: audioFavId,
              dayId: dayContent.dayId,
              type: "audio",
              title: `Audio del Día ${dayContent.dayId}: ${dayContent.theme}`
            })}
            className="text-[10px] text-slate-400 hover:text-gold-400 flex items-center gap-1 transition-all"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite(audioFavId) ? "fill-gold-400 text-gold-400" : ""}`} />
            <span>{isFavorite(audioFavId) ? "Favorito" : "Guardar Audio"}</span>
          </button>
        </div>

        <VturbAudioEmbed
          dayId={dayContent.dayId}
          audioEmbed={dayContent.audioEmbed}
          isCompleted={isCompleted}
          onCompleted={() => {
            if (!isCompleted) onToggleCompletion();
          }}
        />
      </div>

      {/* BLOCK 2: PDF SACRED MANUSCRIPT READER */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gold-400" />
            2. Manuscrito de Oración y Sabiduría
          </span>

          <button
            id={`btn-fav-pdf-${dayContent.dayId}`}
            onClick={() => onToggleFavorite({
              id: pdfFavId,
              dayId: dayContent.dayId,
              type: "manuscript",
              title: `Manuscrito del Día ${dayContent.dayId}: ${dayContent.theme}`
            })}
            className="text-[10px] text-slate-400 hover:text-gold-400 flex items-center gap-1 transition-all"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite(pdfFavId) ? "fill-gold-400 text-gold-400" : ""}`} />
            <span>{isFavorite(pdfFavId) ? "Favorito" : "Guardar Manuscrito"}</span>
          </button>
        </div>

        <PdfViewer
          dayId={dayContent.dayId}
          pdfPath={dayContent.pdfPath}
          title={`${dayContent.theme}: ${dayContent.title}`}
          reflectionText={dayContent.reflection}
          isFavorite={isFavorite(pdfFavId)}
          onToggleFavorite={() => onToggleFavorite({
            id: pdfFavId,
            dayId: dayContent.dayId,
            type: "manuscript",
            title: `Manuscrito del Día ${dayContent.dayId}: ${dayContent.theme}`
          })}
        />
      </div>

      {/* BLOCK 3: PERSONAL SPIRITUAL JOURNAL ENTRY */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-gold-400" />
            3. Tu Altar Íntimo: Diario del Día
          </span>

          <button
            id={`btn-fav-reflection-${dayContent.dayId}`}
            onClick={() => onToggleFavorite({
              id: refFavId,
              dayId: dayContent.dayId,
              type: "reflection",
              title: `Pregunta de Reflexión del Día ${dayContent.dayId}`
            })}
            className="text-[10px] text-slate-400 hover:text-gold-400 flex items-center gap-1 transition-all"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite(refFavId) ? "fill-gold-400 text-gold-400" : ""}`} />
            <span>{isFavorite(refFavId) ? "Favorito" : "Guardar Pregunta"}</span>
          </button>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 lg:p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#f5c26b] block font-serif leading-relaxed">
              {dayContent.question}
            </label>
            <p className="text-[10px] text-slate-500 leading-normal">
              Escribe lo que sientes sinceramente hoy. Esta respuesta se almacena de forma local y encriptada en tu dispositivo.
            </p>
          </div>

          <textarea
            id={`journal-textarea-day-${dayContent.dayId}`}
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full text-xs p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 placeholder:text-slate-600 transition-all font-serif leading-relaxed"
            placeholder="Sintoniza tu respiración y escribe aquí..."
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            
            {/* Auto-save confirmation notification */}
            <div className="text-[10px] flex items-center gap-1.5 min-h-[16px]">
              {saveStatus === "saving" && (
                <span className="text-gold-400 font-mono animate-pulse">Guardando...</span>
              )}
              {saveStatus === "saved" && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Tu reflexión fue guardada en este dispositivo
                </span>
              )}
              {saveStatus === "idle" && (
                <span className="text-slate-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-gold-500/50" />
                  Privado • Sincronizado en Local Storage
                </span>
              )}
            </div>

            <button
              id={`btn-manual-save-diary-day-${dayContent.dayId}`}
              onClick={handleManualSave}
              className="bg-[#241a0d] border border-gold-500/30 text-gold-300 font-bold text-[10px] uppercase py-2 px-4 rounded-xl hover:bg-[#3d2c16] transition-all cursor-pointer"
            >
              Guardar Reflexión
            </button>
          </div>
        </div>
      </div>

      {/* PROMINENT NAVIGATION FOOTER FOR OPTIMAL FLOW */}
      <div className="pt-8 mt-4 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4">
        {dayContent.dayId > 1 ? (
          <button
            id="btn-bottom-prev-day"
            onClick={onPrevDay}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-gold-400" />
            Volver al Día Anterior (Día {dayContent.dayId - 1})
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {dayContent.dayId < 7 ? (
          <button
            id="btn-bottom-next-day"
            onClick={onNextDay}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-500 via-[#dca33e] to-amber-600 hover:from-gold-600 hover:to-amber-700 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_20px_rgba(207,162,83,0.35)] flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <span className="font-sans">Avanzar al Día Siguiente (Día {dayContent.dayId + 1})</span>
            <ChevronRight className="w-5 h-5 stroke-[2.5px] animate-[pulse_1.5s_infinite]" />
          </button>
        ) : (
          <div className="w-full sm:w-auto p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl text-center">
            <span className="text-xs font-bold text-gold-300 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              ¡Felicidades! Has completado la Jornada de 7 Días.
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
