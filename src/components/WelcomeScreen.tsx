import React, { useState } from "react";
import { Sparkles, Key, Lock, Unlock, ShieldAlert, Award } from "lucide-react";

interface WelcomeScreenProps {
  onOpened: () => void;
  soundEnabled: boolean;
}

export default function WelcomeScreen({ onOpened, soundEnabled }: WelcomeScreenProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [stage, setStage] = useState<"closed" | "unlocking" | "opened">("closed");

  const handleOpenChest = () => {
    setIsOpening(true);
    setStage("unlocking");

    // Play welcome audio and temporary chime if sound is enabled
    if (soundEnabled) {
      try {
        const welcomeAudio = new Audio("/0-BIENVENIDO.mp3");
        welcomeAudio.volume = 0.9;
        welcomeAudio.play().catch((err) => {
          console.warn("Could not autoplay welcome audio:", err);
        });
      } catch (err) {
        console.warn("Welcome audio constructor exception:", err);
      }

      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Beautiful mystical 3-chord sequence
        const playChime = (freq: number, delay: number, dur: number) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
          gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
          gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + delay + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + dur);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + delay);
          osc.stop(audioCtx.currentTime + delay + dur);
        };

        playChime(329.63, 0, 1.5);    // E4
        playChime(392.00, 0.3, 1.5);  // G4
        playChime(523.25, 0.6, 2.0);  // C5 (Glint!)
      } catch (e) {}
    }

    // Step-by-step animations
    setTimeout(() => {
      setStage("opened");
      setTimeout(() => {
        onOpened();
      }, 900); // Let the visual of the open chest linger for a premium cinematic feel
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b12] text-white flex flex-col justify-between p-6 overflow-hidden select-none">
      
      {/* Background celestial visual: stars, clouds, golden dust */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#070b12] to-[#020408]" />
      
      {/* Mystic golden clouds / particles in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-gold-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Particle dust elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/4 w-1.5 h-1.5 bg-gold-400 rounded-full animate-ping [animation-duration:3s]" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse [animation-duration:4s]" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-gold-300 rounded-full animate-pulse [animation-duration:2.5s]" />
        <div className="absolute bottom-12 right-1/3 w-1.5 h-1.5 bg-gold-400 rounded-full animate-ping [animation-duration:5s]" />
      </div>

      {/* Top Header Label */}
      <div className="text-center pt-8 relative z-10 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/5 border border-gold-500/20 text-gold-300">
          <Sparkles className="w-3.5 h-3.5 animate-[spin_6s_linear_infinite]" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">
            Revelación Digital
          </span>
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl font-extrabold tracking-wide bg-gradient-to-b from-white via-[#f7e0b5] to-[#cfa253] bg-clip-text text-transparent mt-2">
          El Cofre del Padre Benjamín
        </h1>
        <p className="text-xs text-slate-400 font-medium tracking-wider uppercase font-serif">
          Una jornada espiritual de siete días
        </p>
      </div>

      {/* CENTER COFRE STAGE */}
      <div className="relative flex-1 flex flex-col items-center justify-center py-6 z-10">
        
        {/* Glow halo behind the chest */}
        <div className={`absolute w-56 h-56 rounded-full blur-3xl transition-all duration-1000 ${
          stage === "closed" 
            ? "bg-gold-600/15" 
            : stage === "unlocking"
            ? "bg-gold-500/30 scale-110"
            : "bg-gold-400/50 scale-125"
        }`} />

        {/* Cinematic Animated SVG Chest */}
        <div className={`w-52 h-52 transition-transform duration-500 ${
          stage === "unlocking" ? "animate-bounce scale-105" : stage === "opened" ? "scale-110" : "hover:scale-[1.02]"
        }`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_30px_rgba(207,162,83,0.3)]">
            {/* Chest Shadow */}
            <ellipse cx="100" cy="170" rx="60" ry="10" fill="black" opacity="0.4" />
            
            {/* Chest Backboard */}
            <path d="M40,110 L160,110 L160,160 Q160,165 155,165 L45,165 Q40,165 40,160 Z" fill="#2d1f11" stroke="#cfa253" strokeWidth="2.5" />
            
            {/* Chest Wood Textures & Planks */}
            <rect x="45" y="115" width="110" height="44" fill="#3d2a17" rx="3" />
            <line x1="75" y1="115" x2="75" y2="159" stroke="#22180d" strokeWidth="2" />
            <line x1="125" y1="115" x2="125" y2="159" stroke="#22180d" strokeWidth="2" />

            {/* Lid opening animation depending on stage */}
            <g className={`transition-all duration-700 origin-[100px_110px] ${
              stage === "opened" ? "-translate-y-12 rotate-[-45deg]" : ""
            }`}>
              {/* Chest Lid Base */}
              <path d="M40,110 Q40,75 100,75 Q160,75 160,110 Z" fill="#44301a" stroke="#cfa253" strokeWidth="2.5" />
              {/* Lid Wood Inlay */}
              <path d="M46,108 Q46,80 100,80 Q154,80 154,108 Z" fill="#322212" />
              {/* Iron bands */}
              <path d="M68,110 Q68,78 78,78 L78,110 Z" fill="#1c130a" opacity="0.5" />
              <path d="M122,110 Q122,78 132,78 L132,110 Z" fill="#1c130a" opacity="0.5" />
              {/* Golden trim arch */}
              <path d="M40,110 L160,110" stroke="#cfa253" strokeWidth="3" />
            </g>

            {/* Chest Front Golden Ornaments */}
            <rect x="40" y="115" width="8" height="44" fill="#cfa253" />
            <rect x="152" y="115" width="8" height="44" fill="#cfa253" />
            <circle cx="44" cy="122" r="1.5" fill="#5c451e" />
            <circle cx="44" cy="152" r="1.5" fill="#5c451e" />
            <circle cx="156" cy="122" r="1.5" fill="#5c451e" />
            <circle cx="156" cy="152" r="1.5" fill="#5c451e" />

            {/* Lock Plate */}
            <path d="M85,100 L115,100 L115,128 L85,128 Z" fill="#9e732d" stroke="#ffe596" strokeWidth="1" rx="4" />
            
            {/* Keyhole and lock status */}
            <g className="transition-all duration-300">
              {stage === "closed" ? (
                <>
                  <circle cx="100" cy="112" r="4.5" fill="#1c130a" />
                  <path d="M98.5,112 L101.5,112 L102,122 L98,122 Z" fill="#1c130a" />
                  <circle cx="100" cy="104" r="2.5" fill="#ffd073" className="animate-pulse" />
                </>
              ) : stage === "unlocking" ? (
                <>
                  {/* Glowing key insertion */}
                  <g className="animate-spin duration-1000">
                    <circle cx="100" cy="114" r="6" fill="#ffd073" />
                  </g>
                  <path d="M100,105 L100,124" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse" />
                </>
              ) : (
                /* Unlocked representation */
                <>
                  <circle cx="100" cy="114" r="5" fill="#4ade80" className="animate-pulse" />
                  {/* Beam of glowing holy light spilling out */}
                  <polygon points="90,110 50,20 150,20 110,110" fill="url(#holyLight)" opacity="0.4" />
                </>
              )}
            </g>

            {/* Definition for the gold glow gradient */}
            <defs>
              <linearGradient id="holyLight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffd073" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#070b12" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Dynamic Action Instructions */}
        <div className="text-center max-w-xs mt-6 space-y-1.5 px-4">
          <p className="text-[14px] text-gold-200 font-serif font-semibold italic">
            {stage === "closed" 
              ? "Tu primer paso ya fue dado" 
              : stage === "unlocking"
              ? "Rompiendo los sellos divinos..."
              : "¡Bienvenido, alma bendita!"}
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            {stage === "closed" 
              ? "Ahora es el momento de abrir el Cofre del Padre Benjamín y comenzar una jornada espiritual preparada para acompañarte durante los próximos siete días."
              : stage === "unlocking"
              ? "La luz de la revelación de siete días está saliendo del manuscrito..."
              : "Entrando en tu santuario personal de meditación y oración."}
          </p>
        </div>
      </div>

      {/* BOTTOM BUTTON */}
      <div className="pb-10 pt-2 px-4 text-center relative z-10 shrink-0">
        <button
          id="btn-open-chest"
          onClick={handleOpenChest}
          disabled={isOpening}
          className={`w-full max-w-xs mx-auto py-3.5 px-6 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isOpening
              ? "bg-slate-800 text-slate-500 border border-slate-700"
              : "bg-gradient-to-r from-[#e6c17c] via-[#f7e0b5] to-[#cfa253] text-black shadow-[0_4px_25px_rgba(207,162,83,0.3)] hover:scale-105 active:scale-95"
          }`}
        >
          {isOpening ? (
            <>
              <Key className="w-4 h-4 animate-spin text-slate-500" />
              Abriendo el Cofre...
            </>
          ) : (
            <>
              <Key className="w-4 h-4 text-black animate-bounce" />
              Abrir El Cofre
            </>
          )}
        </button>

        <p className="text-[9px] text-slate-500 mt-4 leading-relaxed max-w-xs mx-auto">
          Este cofre espiritual protege tus notas privadamente. Al presionar el botón confirmas que estás listo para comenzar.
        </p>
      </div>
    </div>
  );
}
