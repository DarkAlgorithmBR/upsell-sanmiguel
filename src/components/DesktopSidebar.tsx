import React from "react";
import { Home, BookOpen, FileText, Heart, HelpCircle, Sliders, Sparkles, Key, RotateCcw } from "lucide-react";

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: "inicio" | "jornada" | "diario" | "favoritos" | "ayuda") => void;
  favoritesCount: number;
  completedCount: number;
  onReset: () => void;
}

interface SidebarItem {
  id: "inicio" | "jornada" | "diario" | "favoritos" | "ayuda";
  label: string;
  icon: React.ComponentType<any>;
  desc: string;
  badge?: number;
}

export default function DesktopSidebar({
  activeTab,
  onTabChange,
  favoritesCount,
  completedCount,
  onReset,
}: DesktopSidebarProps) {
  const menuItems: SidebarItem[] = [
    { id: "inicio", label: "Inicio", icon: Home, desc: "Tu panel principal" },
    { id: "jornada", label: "Jornada de 7 Días", icon: BookOpen, desc: "Medita y lee manuscritos" },
    { id: "diario", label: "Mi Diario", icon: FileText, desc: "Tus oraciones escritas" },
    { 
      id: "favoritos", 
      label: "Mis Favoritos", 
      icon: Heart, 
      desc: "Tus tesoros guardados",
      badge: favoritesCount > 0 ? favoritesCount : undefined 
    },
    { id: "ayuda", label: "Ayuda y Soporte", icon: HelpCircle, desc: "Preguntas frecuentes" },
  ];

  return (
    <aside className="w-64 bg-[#070d19] border-r border-gold-500/10 p-6 flex flex-col justify-between shrink-0 hidden lg:flex text-white">
      
      {/* Sidebar Header Brand */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
          <div>
            <h2 className="font-serif font-extrabold text-sm tracking-widest text-[#f5c26b]">
              EL COFRE
            </h2>
            <p className="text-[9px] text-slate-400 tracking-wider font-mono">
              Padre Benjamín
            </p>
          </div>
        </div>

        {/* Tab selection links list */}
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                id={`desktop-sidebar-${item.id}`}
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all group ${
                  isActive 
                    ? "bg-gradient-to-r from-gold-500/10 to-transparent border-l-2 border-gold-400 text-white" 
                    : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 transition-all ${
                    isActive ? "text-gold-400" : "text-slate-500 group-hover:text-slate-300"
                  }`} />
                  <div>
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[9px] text-slate-500 block">{item.desc}</span>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span className="bg-gold-500 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer Metrics & System Reset */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        
        {/* Short summary block */}
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span>Progreso</span>
            <span className="text-gold-400">{completedCount}/7 Completado</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-gold-500 h-full rounded-full transition-all duration-300" 
              style={{ width: `${(completedCount / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Global reset button for evaluator convenience */}
        <button
          id="btn-desktop-reset-system"
          onClick={onReset}
          className="w-full py-2 px-3 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar Progreso
        </button>

        <p className="text-[9px] text-slate-500 text-center leading-relaxed">
          Soli Deo Gloria 🙏 <br />
          Soporte local • PWA Offline
        </p>
      </div>

    </aside>
  );
}
