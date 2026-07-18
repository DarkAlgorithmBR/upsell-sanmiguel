import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Play, Pause, CheckCircle2, Bookmark, Heart, Calendar, HelpCircle, ArrowRight, Star, Quote, Headphones, Volume2, VolumeX, Lock } from "lucide-react";
import { DAYS_CONTENT } from "../data/journeyContent";
import { DayContent, FavoriteItem, JournalEntry } from "../types";
import ProgressBar from "./ProgressBar";

interface DashboardProps {
  completedDays: number[];
  lastVisitedDay: number;
  favorites: FavoriteItem[];
  journalEntries: JournalEntry[];
  onSelectDay: (dayId: number) => void;
  onNavigateTab: (tab: "inicio" | "jornada" | "diario" | "favoritos" | "ayuda") => void;
  dayAccessTimes?: Record<number, string>;
  bypassWaitTime?: boolean;
}

export default function Dashboard({
  completedDays,
  lastVisitedDay,
  favorites,
  journalEntries,
  onSelectDay,
  onNavigateTab,
  dayAccessTimes = {},
  bypassWaitTime = false,
}: DashboardProps) {
  
  const completedCount = completedDays.length;
  const currentDayContent = DAYS_CONTENT.find((d) => d.dayId === lastVisitedDay) || DAYS_CONTENT[0];

  // Lock Modal State
  const [lockedDayModal, setLockedDayModal] = useState<{ dayId: number; remainingTime: string; theme: string } | null>(null);

  // Check if a day is locked (requires previous day accessed at least 24 hours ago)
  const getDayLockStatus = (dayId: number) => {
    if (dayId === 1) return { isLocked: false, remainingTime: "" };
    if (bypassWaitTime) return { isLocked: false, remainingTime: "" };

    const prevDayId = dayId - 1;
    const prevDayAccessTime = dayAccessTimes?.[prevDayId];
    if (!prevDayAccessTime) {
      return { isLocked: true, remainingTime: "Completa el Día anterior" };
    }

    const accessDate = new Date(prevDayAccessTime);
    const unlockDate = new Date(accessDate.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();

    if (now >= unlockDate) {
      return { isLocked: false, remainingTime: "" };
    }

    // Calculate countdown
    const diffMs = unlockDate.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      isLocked: true,
      remainingTime: `Disponible en ${hours}h ${minutes}m`
    };
  };

  // Welcome Audio State
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingWelcome, setIsPlayingWelcome] = useState(false);
  const [welcomeCurrentTime, setWelcomeCurrentTime] = useState(0);
  const [welcomeDuration, setWelcomeDuration] = useState(0);
  const [isWelcomeMuted, setIsWelcomeMuted] = useState(false);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (welcomeAudioRef.current) {
        welcomeAudioRef.current.pause();
      }
    };
  }, []);

  const togglePlayWelcome = () => {
    if (!welcomeAudioRef.current) return;

    if (isPlayingWelcome) {
      welcomeAudioRef.current.pause();
      setIsPlayingWelcome(false);
    } else {
      welcomeAudioRef.current.play()
        .then(() => {
          setIsPlayingWelcome(true);
        })
        .catch((err) => {
          console.warn("Autoplay / welcome audio play blocked or failed:", err);
        });
    }
  };

  const handleTimeUpdateWelcome = () => {
    if (welcomeAudioRef.current) {
      setWelcomeCurrentTime(welcomeAudioRef.current.currentTime);
    }
  };

  const handleLoadedMetadataWelcome = () => {
    if (welcomeAudioRef.current) {
      setWelcomeDuration(welcomeAudioRef.current.duration);
    }
  };

  const handleEndedWelcome = () => {
    setIsPlayingWelcome(false);
    setWelcomeCurrentTime(0);
  };

  const toggleMuteWelcome = () => {
    if (welcomeAudioRef.current) {
      const nextMute = !isWelcomeMuted;
      setIsWelcomeMuted(nextMute);
      welcomeAudioRef.current.muted = nextMute;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const welcomeProgressPercent = welcomeDuration > 0 ? (welcomeCurrentTime / welcomeDuration) * 100 : 0;

  // Random encouraging spiritual quotes in Spanish based on day completions
  const quotes = [
    { text: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios.", ref: "Isaías 41:10" },
    { text: "El alma que se entrega con fe sincera florece bajo el rocío celestial.", ref: "Padre Benjamín" },
    { text: "Los tesoros de este cofre espiritual ya habitan en tu corazón. Hazlos brillar hoy.", ref: "Padre Benjamín" },
    { text: "Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas.", ref: "Jeremías 33:3" }
  ];

  // Select a quote based on completion count to make it dynamic
  const activeQuote = quotes[completedCount % quotes.length];

  return (
    <div className="space-y-6 text-white pb-10 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Hidden Welcome Audio Tag */}
      <audio
        ref={welcomeAudioRef}
        src="/0-BIENVENIDO.mp3"
        onTimeUpdate={handleTimeUpdateWelcome}
        onLoadedMetadata={handleLoadedMetadataWelcome}
        onEnded={handleEndedWelcome}
        preload="metadata"
      />

      {/* Dynamic Greetings Card */}
      <div className="relative bg-gradient-to-r from-slate-900 via-[#0a1329] to-slate-950 border border-gold-500/10 rounded-3xl p-6 overflow-hidden">
        
        {/* Decorative corner light flare */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest font-mono flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold-400" />
              Santuario Personal Guardado
            </span>
            <h2 className="text-xl lg:text-2xl font-serif font-extrabold text-slate-100">
              Bienvenido al Portal del Silencio
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Has tomado el timón de tu fe. Explora hoy el cofre sagrado, lee el manuscrito reservado y escribe tus plegarias secretas.
            </p>
          </div>

          {/* ELEGANT COMPACT WELCOME AUDIO PLAYER */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-gold-500/15 max-w-xl space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-gold-400 animate-bounce" />
                <span className="text-[10px] font-extrabold text-gold-300 uppercase tracking-wider font-mono">
                  Mensaje de Bienvenida del Padre Benjamín
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-500">Audio 0</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-play-welcome-dashboard"
                onClick={togglePlayWelcome}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isPlayingWelcome
                    ? "bg-gold-500 text-black hover:bg-gold-600 scale-105"
                    : "bg-slate-900 border border-gold-400/30 text-gold-300 hover:bg-gold-500/10"
                }`}
                title={isPlayingWelcome ? "Pausar Bienvenida" : "Escuchar Bienvenida"}
              >
                {isPlayingWelcome ? <Pause className="w-4.5 h-4.5 fill-black" /> : <Play className="w-4.5 h-4.5 ml-0.5 fill-gold-300" />}
              </button>

              <div className="flex-1 space-y-1.5">
                {/* Progress bar */}
                <div className="relative w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-gold-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${welcomeProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[8px] font-mono text-slate-500">
                  <span>{formatTime(welcomeCurrentTime)}</span>
                  <span>{formatTime(welcomeDuration || 180)}</span>
                </div>
              </div>

              {/* Mute button */}
              <button
                id="btn-mute-welcome-dashboard"
                onClick={toggleMuteWelcome}
                className="p-1.5 text-slate-400 hover:text-gold-400 transition-colors cursor-pointer"
                title={isWelcomeMuted ? "Activar audio" : "Silenciar"}
              >
                {isWelcomeMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* CONTINUE JOURNEY BUTTON */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              id="btn-continue-journey"
              onClick={() => onSelectDay(lastVisitedDay)}
              className="bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 hover:from-gold-600 hover:to-gold-700 text-black font-extrabold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-95 uppercase tracking-wider cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              Continuar Jornada (Día {lastVisitedDay})
            </button>

            <span className="text-[10px] text-slate-500 italic text-center sm:text-left">
              Último visitado: <strong className="text-gold-400/80">{currentDayContent.theme}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* PROGRESS COMPONENT */}
      <ProgressBar completedCount={completedCount} />

      {/* BIBLE QUOTE BOX */}
      <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 flex gap-3 text-xs italic text-slate-300 leading-relaxed relative">
        <Quote className="w-8 h-8 text-gold-500/10 absolute top-2 left-2 pointer-events-none shrink-0" />
        <div className="pl-6 space-y-1">
          <p className="font-serif">"{activeQuote.text}"</p>
          <span className="text-[10px] font-mono text-gold-400/70 not-italic block">— {activeQuote.ref}</span>
        </div>
      </div>

      {/* 7 DAYS TIMELINE GRID */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping"></span>
            Los Manuscritos del Cofre (7 Días)
          </h3>
          <span className="text-[10px] text-slate-500">24 horas entre cada día consecutivo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS_CONTENT.map((day) => {
            const isDayCompleted = completedDays.includes(day.dayId);
            const isLastVisited = lastVisitedDay === day.dayId;
            const lockStatus = getDayLockStatus(day.dayId);

            return (
              <button
                id={`dashboard-day-card-${day.dayId}`}
                key={day.dayId}
                onClick={() => {
                  if (lockStatus.isLocked) {
                    setLockedDayModal({
                      dayId: day.dayId,
                      remainingTime: lockStatus.remainingTime,
                      theme: day.theme,
                    });
                  } else {
                    onSelectDay(day.dayId);
                  }
                }}
                className={`w-full text-left rounded-2xl border p-4 transition-all relative flex flex-col justify-between min-h-[135px] cursor-pointer group ${
                  lockStatus.isLocked
                    ? "bg-[#040915]/40 border-slate-900/60 opacity-65 hover:opacity-90"
                    : isDayCompleted
                    ? "bg-[#0b172a]/60 border-emerald-500/20 hover:border-emerald-500/40"
                    : isLastVisited
                    ? "bg-slate-900 border-gold-500/30 hover:border-gold-500/50 shadow-sm"
                    : "bg-slate-900/45 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                
                {/* Top header badge */}
                <div className="flex justify-between items-start gap-2 w-full">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-gold-400/80 font-mono">
                    DÍA {day.dayId}
                  </span>

                  {lockStatus.isLocked ? (
                    <span className="bg-slate-950 text-slate-500 text-[8px] font-bold px-2 py-0.5 rounded-full border border-slate-850 flex items-center gap-1 font-mono">
                      <Lock className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                      Bloqueado
                    </span>
                  ) : isDayCompleted ? (
                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completado
                    </span>
                  ) : isLastVisited ? (
                    <span className="bg-gold-500/10 text-gold-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-gold-500/20 animate-pulse">
                      Siguiente
                    </span>
                  ) : null}
                </div>

                {/* Theme and Title text details */}
                <div className="my-2.5 space-y-0.5">
                  <h4 className={`text-xs font-extrabold font-serif transition-colors ${
                    lockStatus.isLocked 
                      ? "text-slate-500" 
                      : "text-slate-400 group-hover:text-gold-300"
                  }`}>
                    {day.theme}
                  </h4>
                  <p className={`text-[11px] line-clamp-2 leading-relaxed ${
                    lockStatus.isLocked ? "text-slate-600" : "text-slate-300"
                  }`}>
                    {day.title}
                  </p>
                </div>

                {/* Card footer details */}
                <div className="flex justify-between items-center w-full pt-2.5 border-t border-slate-800/40 text-[9px] text-slate-500">
                  <span className="font-mono">Audio: {day.durationLabel} mins</span>
                  {lockStatus.isLocked ? (
                    <span className="text-amber-500/70 font-bold font-mono text-[8px] flex items-center gap-0.5">
                      {lockStatus.remainingTime}
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 font-semibold text-gold-500/70 group-hover:text-gold-400 transition-all">
                      Abrir Manuscrito
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </div>

              </button>
            );
          })}
        </div>
      </div>

      {/* RECENT ACTIVITY BENTO BLOCK: DIARY & FAVORITES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Diary Preview Box */}
        <div className="bg-slate-900/30 border border-slate-800/70 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-400" />
              Anotaciones Recientes
            </h4>
            <button
              id="btn-dashboard-go-diary"
              onClick={() => onNavigateTab("diario")}
              className="text-[10px] text-gold-400 hover:underline font-bold"
            >
              Ver Todo
            </button>
          </div>

          {journalEntries.length === 0 ? (
            <p className="text-[11px] text-slate-500 italic py-4 text-center">
              Aún no has registrado oraciones en tu diario. Abre tu primer día para escribir tu sentir.
            </p>
          ) : (
            <div className="space-y-2">
              {journalEntries.slice(-2).reverse().map((entry) => {
                const correspondingDay = DAYS_CONTENT.find((d) => d.dayId === entry.dayId);
                return (
                  <div key={entry.dayId} className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-gold-400 font-mono">
                        DÍA {entry.dayId} • {correspondingDay?.theme}
                      </span>
                      <span className="text-[8px] text-slate-500">
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 line-clamp-2 italic">
                      "{entry.text}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Favorites Preview Box */}
        <div className="bg-slate-900/30 border border-slate-800/70 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-gold-400 fill-gold-400" />
              Favoritos Salvados
            </h4>
            <button
              id="btn-dashboard-go-favorites"
              onClick={() => onNavigateTab("favoritos")}
              className="text-[10px] text-gold-400 hover:underline font-bold"
            >
              Ver Todo
            </button>
          </div>

          {favorites.length === 0 ? (
            <p className="text-[11px] text-slate-500 italic py-4 text-center">
              No tienes elementos favoritos marcados en el cofre.
            </p>
          ) : (
            <div className="space-y-2">
              {favorites.slice(0, 3).map((fav) => (
                <div
                  id={`dashboard-fav-preview-${fav.id}`}
                  key={fav.id}
                  onClick={() => onSelectDay(fav.dayId)}
                  className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900 flex justify-between items-center hover:border-slate-800/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Star className="w-3 h-3 text-gold-400 fill-gold-400 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-200 truncate pr-2">
                      {fav.title}
                    </span>
                  </div>
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-gold-400 font-mono shrink-0">
                    Día {fav.dayId}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* LOCKED DAY MODAL ACCENT */}
      {lockedDayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#0b1222] border-2 border-gold-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-gold-400">
              <Lock className="w-8 h-8 text-gold-400 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-extrabold text-gold-400 uppercase tracking-widest">
                Día {lockedDayModal.dayId} • Contenido Consagrado
              </span>
              <h3 className="text-lg font-serif font-extrabold text-slate-100">
                {lockedDayModal.theme}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                La jornada de meditación requiere un intervalo de <strong className="text-gold-400">24 horas de asimilación</strong> espiritual entre cada día consecutivo. 
              </p>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                Regresa después para escuchar el mensaje y manuscrito del Padre Benjamín.
              </p>
            </div>

            <div className="bg-slate-950/80 rounded-2xl py-3 px-4 border border-gold-500/10 font-mono text-xs flex justify-between items-center text-slate-300">
              <span>Tiempo restante:</span>
              <span className="text-gold-400 font-bold">{lockedDayModal.remainingTime}</span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                id="btn-close-lock-modal"
                onClick={() => setLockedDayModal(null)}
                className="w-full py-3 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-98"
              >
                Comprendido, Esperaré
              </button>
              
              <p className="text-[9px] text-slate-500">
                *Puedes activar el bypass en "Ajustes" para pruebas rápidas.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
