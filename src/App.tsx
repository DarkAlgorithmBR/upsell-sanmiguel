import React, { useState, useEffect } from "react";
import { Sparkles, Volume2, VolumeX, RotateCcw, Sliders, CheckCircle2, Lock, Heart, ShieldAlert, Award } from "lucide-react";
import { useLocalJourney } from "./hooks/useLocalJourney";
import { DAYS_CONTENT } from "./data/journeyContent";
import WelcomeScreen from "./components/WelcomeScreen";
import Dashboard from "./components/Dashboard";
import JourneyDay from "./components/JourneyDay";
import SpiritualJournal from "./components/SpiritualJournal";
import Favorites from "./components/Favorites";
import HelpPage from "./components/HelpPage";
import BottomNavigation from "./components/BottomNavigation";
import DesktopSidebar from "./components/DesktopSidebar";

export default function App() {
  const {
    state,
    openVault,
    closeVault,
    setLastVisitedDay,
    toggleSound,
    toggleDayCompletion,
    setDayCompleted,
    toggleFavorite,
    isFavorite,
    saveJournalEntry,
    deleteJournalEntry,
    clearAllData,
    recordDayAccess,
    toggleBypassWaitTime,
    simulatePass24Hours,
  } = useLocalJourney();

  const [activeTab, setActiveTab] = useState<"inicio" | "jornada" | "diario" | "favoritos" | "ayuda">("inicio");
  const [showTesterPanel, setShowTesterPanel] = useState(false);

  // Sync state.lastVisitedDay as the default viewing day
  const activeDayId = state.lastVisitedDay;
  const activeDayContent = DAYS_CONTENT.find((d) => d.dayId === activeDayId) || DAYS_CONTENT[0];

  // Check lock status for a given dayId
  const getDayLockStatusInApp = (dayId: number) => {
    if (dayId === 1) return { isLocked: false, remainingTime: "" };
    if (state.bypassWaitTime) return { isLocked: false, remainingTime: "" };

    const prevDayId = dayId - 1;
    const prevDayAccessTime = state.dayAccessTimes?.[prevDayId];
    if (!prevDayAccessTime) {
      return { isLocked: true, remainingTime: "Completa el día anterior" };
    }

    const accessDate = new Date(prevDayAccessTime);
    const unlockDate = new Date(accessDate.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();

    if (now >= unlockDate) {
      return { isLocked: false, remainingTime: "" };
    }

    const diffMs = unlockDate.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      isLocked: true,
      remainingTime: `Disponible en ${hours}h ${minutes}m`
    };
  };

  const activeDayLockStatus = getDayLockStatusInApp(activeDayId);

  const handleSelectDay = (dayId: number) => {
    setLastVisitedDay(dayId);
    setActiveTab("jornada");
  };

  const handlePrevDay = () => {
    if (activeDayId > 1) {
      setLastVisitedDay(activeDayId - 1);
    }
  };

  const handleNextDay = () => {
    if (activeDayId < 7) {
      setLastVisitedDay(activeDayId + 1);
    }
  };

  const handleResetConfirm = () => {
    if (window.confirm("¿Seguro que deseas reiniciar todo tu progreso de 7 días y borrar tu diario? Esta acción es irreversible.")) {
      clearAllData();
      setActiveTab("inicio");
      closeVault();
    }
  };

  const handleSimulateAllCompleted = () => {
    [1, 2, 3, 4, 5, 6, 7].forEach((id) => setDayCompleted(id, true));
    alert("¡Felicidades! Todos los 7 días de meditación han sido marcados como completados.");
  };

  // If the vault is not yet opened, show the majestic animated portal
  if (!state.isVaultOpened) {
    return (
      <WelcomeScreen
        onOpened={openVault}
        soundEnabled={state.soundEnabled}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#02050b] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-gold-500/30 selection:text-white">
      
      {/* Background stardust glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* DESKTOP LEFT SIDEBAR NAVIGATION */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={state.favorites.length}
        completedCount={state.completedDays.length}
        onReset={handleResetConfirm}
      />

      {/* PRIMARY CENTRAL SCREEN AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* TOP STATUS BAR (Shared on mobile and desktop header) */}
        <header className="bg-[#070d19]/90 backdrop-blur-md border-b border-gold-500/10 px-5 py-4 flex justify-between items-center relative z-30 shrink-0">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-gold-400 animate-pulse" />
            <div>
              <span className="text-[10px] font-extrabold text-gold-400 uppercase tracking-widest block font-mono">
                El Cofre Abierto
              </span>
              <h1 className="text-xs font-serif font-bold text-slate-100 uppercase tracking-wider block">
                Padre Benjamín
              </h1>
            </div>
          </div>

          {/* Quick Header actions */}
          <div className="flex items-center gap-2">
            
            {/* Quick sound toggle */}
            <button
              id="btn-header-toggle-sound"
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all ${
                state.soundEnabled
                  ? "bg-gold-500/10 border-gold-500/20 text-gold-400"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
              title={state.soundEnabled ? "Silenciar sonidos espirituales" : "Activar sonidos espirituales"}
            >
              {state.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick simulator triggers */}
            <button
              id="btn-header-toggle-tester"
              onClick={() => setShowTesterPanel(!showTesterPanel)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                showTesterPanel
                  ? "bg-gold-500 text-black"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Ajustes rápidos de prueba"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Ajustes</span>
            </button>
          </div>
        </header>

        {/* EVALUATOR SIMULATOR CONTROLS (collapsible banner) */}
        {showTesterPanel && (
          <div id="evaluator-tester-panel" className="bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-amber-950/40 border-b border-gold-500/25 p-4 relative z-20 animate-[slideDown_0.2s_ease-out] text-slate-200">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-1">
                  <Sliders className="w-4 h-4" />
                  Consola de Ajustes Rápidos (Testigo de Calidad)
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Utiliza estos accesos directos para saltar entre estados de prueba del cofre sin esperas de tiempo real.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  id="btn-tester-toggle-bypass"
                  onClick={toggleBypassWaitTime}
                  className={`font-extrabold text-[10px] uppercase tracking-wide py-2 px-3.5 rounded-lg transition-all cursor-pointer ${
                    state.bypassWaitTime
                      ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                      : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  ⏳ Omitir Espera: {state.bypassWaitTime ? "SÍ" : "NO"}
                </button>

                <button
                  id="btn-tester-simulate-24h"
                  onClick={() => {
                    simulatePass24Hours();
                    alert("Se han restado 24 horas a los registros de acceso. ¡Prueba a ver si el siguiente día se ha desbloqueado!");
                  }}
                  className="bg-sky-950/60 border border-sky-500/30 hover:bg-sky-950/80 text-sky-400 font-bold text-[10px] uppercase tracking-wide py-2 px-3.5 rounded-lg transition-all cursor-pointer"
                >
                  ⏩ Simular +24 horas
                </button>

                <button
                  id="btn-tester-complete-all"
                  onClick={handleSimulateAllCompleted}
                  className="bg-gold-500 hover:bg-gold-600 text-black font-extrabold text-[10px] uppercase tracking-wide py-2 px-3.5 rounded-lg transition-all cursor-pointer"
                >
                  ✔️ Completar Todo
                </button>
                
                <button
                  id="btn-tester-clear"
                  onClick={handleResetConfirm}
                  className="bg-red-950/60 border border-red-500/30 hover:bg-red-950/80 text-red-400 font-bold text-[10px] uppercase tracking-wide py-2 px-3.5 rounded-lg transition-all cursor-pointer"
                >
                  🔄 Reiniciar Estado
                </button>

                <button
                  id="btn-tester-close-vault"
                  onClick={() => {
                    closeVault();
                    setActiveTab("inicio");
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] uppercase tracking-wide py-2 px-3.5 rounded-lg transition-all cursor-pointer"
                >
                  🔒 Cerrar Cofre
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MIDDLE VIEWPORT CONTENT AREA */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-10 py-6 max-w-4xl w-full mx-auto pb-24 lg:pb-12">
          
          {/* RENDER THE ACTIVE VIEW TAB */}
          {activeTab === "inicio" && (
            <Dashboard
              completedDays={state.completedDays}
              lastVisitedDay={activeDayId}
              favorites={state.favorites}
              journalEntries={state.journalEntries}
              onSelectDay={handleSelectDay}
              onNavigateTab={setActiveTab}
              dayAccessTimes={state.dayAccessTimes}
              bypassWaitTime={state.bypassWaitTime}
            />
          )}

          {activeTab === "jornada" && (
            <JourneyDay
              dayContent={activeDayContent}
              isCompleted={state.completedDays.includes(activeDayId)}
              onToggleCompletion={() => toggleDayCompletion(activeDayId)}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              journalText={state.journalEntries.find((e) => e.dayId === activeDayId)?.text || ""}
              onSaveJournal={(text) => saveJournalEntry(activeDayId, text)}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              isLocked={activeDayLockStatus.isLocked}
              remainingTime={activeDayLockStatus.remainingTime}
            />
          )}

          {activeTab === "diario" && (
            <SpiritualJournal
              entries={state.journalEntries}
              onSaveEntry={saveJournalEntry}
              onDeleteEntry={deleteJournalEntry}
              onNavigateToDay={handleSelectDay}
            />
          )}

          {activeTab === "favoritos" && (
            <Favorites
              favorites={state.favorites}
              onToggleFavorite={toggleFavorite}
              onNavigateToDay={handleSelectDay}
            />
          )}

          {activeTab === "ayuda" && (
            <HelpPage />
          )}

        </main>

        {/* BOTTOM GLOBAL DISCLAIMER (Sticky Footer) */}
        <footer className="bg-slate-950/60 border-t border-slate-900 py-3.5 px-6 text-center text-[10px] text-slate-500 shrink-0 select-none">
          <div className="max-w-2xl mx-auto space-y-1">
            <p className="leading-relaxed">
              Este contenido tiene fines educativos, reflexivos y espirituales. No sustituye orientación médica, psicológica, jurídica o financiera.
            </p>
            <p className="text-[9px] text-slate-600 font-mono">
              © El Cofre del Padre Benjamín • Guardado Local • Soli Deo Gloria
            </p>
          </div>
        </footer>

      </div>

      {/* MOBILE SCREEN BOTTOM NAV BAR BAR */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={state.favorites.length}
      />

    </div>
  );
}
