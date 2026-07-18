import React from "react";
import { Heart, Trash2, ArrowRight, BookOpen, FileText, Music, Sparkles } from "lucide-react";
import { FavoriteItem } from "../types";

interface FavoritesProps {
  favorites: FavoriteItem[];
  onToggleFavorite: (item: Omit<FavoriteItem, "savedAt">) => void;
  onNavigateToDay: (dayId: number) => void;
}

export default function Favorites({ favorites, onToggleFavorite, onNavigateToDay }: FavoritesProps) {
  
  const handleRemove = (fav: FavoriteItem) => {
    onToggleFavorite({
      id: fav.id,
      dayId: fav.dayId,
      type: fav.type,
      title: fav.title
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 px-6 space-y-4 text-slate-400 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-600">
          <Heart className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 max-w-xs mx-auto">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-serif">
            Aún no hay favoritos
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Puedes marcar manuscritos, reflexiones, audios o días completos tocando el ícono de corazón <Heart className="w-3 h-3 inline text-gold-400 fill-gold-400" /> en cada módulo.
          </p>
        </div>
      </div>
    );
  }

  // Group items by type for elegant visual segmentation
  const types = [
    { key: "day", label: "Días Completos", icon: BookOpen, color: "text-blue-400 bg-blue-500/10" },
    { key: "manuscript", label: "Manuscritos PDFs", icon: FileText, color: "text-amber-400 bg-amber-500/10" },
    { key: "audio", label: "Audios Vturb", icon: Music, color: "text-emerald-400 bg-emerald-500/10" },
    { key: "reflection", label: "Reflexiones", icon: Sparkles, color: "text-purple-400 bg-purple-500/10" },
  ] as const;

  return (
    <div className="space-y-6 text-white pb-10">
      
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-serif font-bold text-gold-400 flex items-center gap-2">
          <Heart className="w-5 h-5 text-gold-400 fill-gold-400" />
          Mis Favoritos
        </h3>
        <p className="text-xs text-slate-400">
          Tus manuscritos predilectos y reflexiones salvadas localmente en este dispositivo.
        </p>
      </div>

      {/* Segmented lists */}
      <div className="space-y-5">
        {types.map((t) => {
          const filtered = favorites.filter((fav) => fav.type === t.key);
          if (filtered.length === 0) return null;

          const Icon = t.icon;

          return (
            <div key={t.key} className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </h4>

              <div className="space-y-2">
                {filtered.map((fav) => (
                  <div
                    id={`favorite-item-${fav.id}`}
                    key={fav.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-slate-700/60 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Decorative icon box */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.color}`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>

                      <div className="min-w-0">
                        <span className="text-[9px] text-gold-400 font-bold block uppercase tracking-wider font-mono">
                          Día {fav.dayId}
                        </span>
                        <p className="text-xs font-bold text-slate-200 truncate leading-snug">
                          {fav.title}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        id={`btn-go-to-favorite-day-${fav.id}`}
                        onClick={() => onNavigateToDay(fav.dayId)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Ir al Día"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        id={`btn-delete-favorite-${fav.id}`}
                        onClick={() => handleRemove(fav)}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                        title="Eliminar de favoritos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
