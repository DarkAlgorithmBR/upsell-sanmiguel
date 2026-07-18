import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Check, Rewind, FastForward, HelpCircle } from "lucide-react";

interface VturbAudioEmbedProps {
  dayId: number;
  audioEmbed: string; // Left for backwards compatibility, we will prioritize local MP3s
  onCompleted: () => void;
  isCompleted: boolean;
}

export default function VturbAudioEmbed({
  dayId,
  onCompleted,
  isCompleted,
}: VturbAudioEmbedProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audioError, setAudioError] = useState(false);

  // Generate candidate file names to try in order
  const getCandidates = (id: number): string[] => {
    const padded = id < 10 ? `0${id}` : `${id}`;
    
    // Exact mapping for the uploaded audio files
    const exactMapping: Record<number, string[]> = {
      1: ["/01-Hoy abriremos.mp3"],
      2: ["/02-Segunda Mesaje.mp3"],
      3: ["/03-Tercera Mesaje.mp3"],
      4: ["/04-CUARTO MENSAJE.mp3"],
      5: ["/05-QUINTO MENSAJE.mp3"],
      6: ["/06-SEXTO MENSAJE.mp3"],
      7: ["/07-SÉPTIMO MENSAJE.mp3", "/07-SEPTIMO MENSAJE.mp3"],
    };

    if (exactMapping[id]) {
      return [...exactMapping[id], `/${padded}.mp3`, `/${id}.mp3`];
    }

    return [
      `/${padded}.mp3`,
      `/${id}.mp3`
    ];
  };

  const candidates = getCandidates(dayId);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const activeSource = candidates[candidateIndex] || candidates[0];

  // Reset candidates on dayId change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioError(false);
    setCandidateIndex(0);

    if (audioRef.current) {
      audioRef.current.pause();
      // Important: must call load to apply the fresh source when changing day
      audioRef.current.load();
    }
  }, [dayId]);

  // Handle errors and switch to next candidate
  const handleAudioError = () => {
    if (candidateIndex < candidates.length - 1) {
      const nextIdx = candidateIndex + 1;
      setCandidateIndex(nextIdx);
      // Wait for React to apply src then load
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          if (isPlaying) {
            audioRef.current.play().catch(() => {
              // Ignore play interruption on failed candidate
            });
          }
        }
      }, 50);
    } else {
      // All candidates exhausted, show warning box
      setAudioError(true);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch((err) => {
          console.warn("Audio play failed, attempting next candidate...", err);
          handleAudioError();
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
    onCompleted();
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMute = !isMuted;
      setIsMuted(nextMute);
      audioRef.current.muted = nextMute;
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-b from-slate-900 to-black border border-gold-500/20 rounded-2xl p-5 shadow-inner text-white relative overflow-hidden">
      {/* Native audio element */}
      <audio
        ref={audioRef}
        src={activeSource}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="metadata"
      />

      {/* Subtle background glow */}
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gold-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-4">
        {/* Status header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? "bg-gold-400" : "bg-gold-500"} opacity-75`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
            </span>
            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest font-mono">
              AUDIO SAGRADO • DÍA {dayId}
            </span>
          </div>

          {isCompleted && (
            <span className="text-[10px] font-extrabold text-gold-400 flex items-center gap-1 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/25">
              <Check className="w-3 h-3" />
              Sesión Completada
            </span>
          )}
        </div>

        {/* Player Controls layout */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Seek/Skip backward, Play/Pause, Seek/Skip forward panel */}
          <div className="flex items-center gap-3">
            <button
              id={`btn-skip-back-${dayId}`}
              onClick={handleSkipBackward}
              className="p-2 text-slate-400 hover:text-gold-300 transition-colors cursor-pointer"
              title="Retroceder 10 segundos"
            >
              <Rewind className="w-4 h-4" />
            </button>

            <button
              id={`btn-toggle-local-audio-${dayId}`}
              onClick={togglePlay}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isPlaying
                  ? "bg-gold-500 text-black hover:bg-gold-600 scale-105 shadow-[0_0_15px_rgba(207,162,83,0.4)]"
                  : "bg-transparent border border-gold-400/40 text-gold-300 hover:border-gold-300 hover:bg-gold-500/10"
              }`}
              title={isPlaying ? "Pausar Meditación" : "Iniciar Meditación"}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 ml-0.5 fill-gold-300" />}
            </button>

            <button
              id={`btn-skip-forward-${dayId}`}
              onClick={handleSkipForward}
              className="p-2 text-slate-400 hover:text-gold-300 transition-colors cursor-pointer"
              title="Adelantar 10 segundos"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>

          {/* Audio metadata info */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h4 className="text-xs font-bold text-slate-200 truncate font-serif">
              Meditación Guiada del Día {dayId}
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-center md:justify-start gap-1">
              <span>Padre Benjamín</span>
              <span>•</span>
              <span className="text-gold-400/80 font-mono">{formatTime(duration || 360)} de audio espiritual</span>
            </p>
          </div>

          {/* Volume and Mute controls */}
          <div className="flex items-center gap-2 shrink-0 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/60">
            <button
              id={`btn-mute-local-${dayId}`}
              onClick={toggleMute}
              className="p-1 text-slate-400 hover:text-gold-400 transition-colors cursor-pointer"
              title={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              id={`slider-volume-local-${dayId}`}
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
              title="Ajustar Volumen"
            />
          </div>
        </div>

        {/* Custom Seek Bar Slider */}
        <div className="space-y-1">
          <div className="relative group">
            <input
              id={`slider-progress-local-${dayId}`}
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-500 hover:bg-slate-700 transition-colors"
              title="Progreso de Reproducción"
            />
            {/* Elegant visual tracking of the bar progress */}
            <div 
              className="absolute left-0 top-0 h-1.5 bg-gold-500 rounded-lg pointer-events-none opacity-40 max-w-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 select-none">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Informative error or helper hint block */}
        {audioError && (
          <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 text-[10px] text-amber-300 flex items-start gap-2 animate-[slideDown_0.2s_ease-out]">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <p className="font-bold">Información de archivo de audio:</p>
              <p>
                No se encontró un audio local para el Día {dayId}. Sube tus archivos de audio a la carpeta <code className="bg-slate-950 px-1 py-0.5 rounded font-mono text-gold-300 font-bold">public/</code> con nombres como <code className="bg-slate-950 px-1 py-0.5 rounded font-mono text-gold-300 font-bold">0{dayId}.mp3</code> o similar.
              </p>
            </div>
          </div>
        )}

        {/* Admin Shortcut for testing / instant completion */}
        <div className="pt-2 border-t border-slate-800/50 flex justify-between items-center text-[10px]">
          <span className="text-slate-500 italic select-none">Escucha atentamente este manuscrito sonoro.</span>
          <button
            id={`btn-complete-audio-shortcut-${dayId}`}
            onClick={handleAudioEnded}
            className="text-gold-500 hover:text-gold-400 font-bold transition-colors cursor-pointer hover:underline"
            title="Siguiente paso de la jornada"
          >
            Marcar audio como concluido
          </button>
        </div>
      </div>
    </div>
  );
}
