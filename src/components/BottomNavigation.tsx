import React from "react";
import { Home, BookOpen, FileText, Heart, HelpCircle } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: "inicio" | "jornada" | "diario" | "favoritos" | "ayuda") => void;
  favoritesCount: number;
}

interface NavItem {
  id: "inicio" | "jornada" | "diario" | "favoritos" | "ayuda";
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

export default function BottomNavigation({ activeTab, onTabChange, favoritesCount }: BottomNavigationProps) {
  const menuItems: NavItem[] = [
    { id: "inicio", label: "Inicio", icon: Home },
    { id: "jornada", label: "Jornada", icon: BookOpen },
    { id: "diario", label: "Diario", icon: FileText },
    { 
      id: "favoritos", 
      label: "Favoritos", 
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : undefined
    },
    { id: "ayuda", label: "Ayuda", icon: HelpCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#070d19]/95 backdrop-blur-md border-t border-gold-500/15 py-1 px-2 flex justify-around items-center text-white">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            id={`bottom-nav-${item.id}`}
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex-1 py-1.5 flex flex-col items-center justify-center relative transition-all"
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              isActive 
                ? "text-gold-400 scale-105" 
                : "text-slate-400 hover:text-slate-200"
            }`}>
              <Icon className="w-5 h-5" />
              
              {/* Optional badge counter for Favorites */}
              {item.badge !== undefined && (
                <span className="absolute top-1.5 right-1/2 translate-x-3.5 bg-gold-500 text-black text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              )}
            </div>

            <span className={`text-[9px] tracking-wide font-medium ${
              isActive ? "text-gold-400 font-bold" : "text-slate-400"
            }`}>
              {item.label}
            </span>

            {/* Glowing active indicator line */}
            {isActive && (
              <div className="absolute top-0 w-8 h-[2px] bg-gold-400 rounded-full shadow-[0_0_8px_#f5c26b]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
