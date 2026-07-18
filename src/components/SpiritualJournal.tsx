import React, { useState } from "react";
import { FileText, Copy, Trash2, Edit2, Download, Check, AlertCircle, Save, Calendar, Sparkles } from "lucide-react";
import { DAYS_CONTENT } from "../data/journeyContent";
import { JournalEntry } from "../types";

interface SpiritualJournalProps {
  entries: JournalEntry[];
  onSaveEntry: (dayId: number, text: string) => void;
  onDeleteEntry: (dayId: number) => void;
  onNavigateToDay: (dayId: number) => void;
}

export default function SpiritualJournal({
  entries,
  onSaveEntry,
  onDeleteEntry,
  onNavigateToDay,
}: SpiritualJournalProps) {
  const [editingDayId, setEditingDayId] = useState<number | null>(null);
  const [editBuffer, setEditBuffer] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [saveToast, setSaveToast] = useState<number | null>(null);

  const handleCopy = (dayId: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(dayId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleStartEdit = (dayId: number, currentText: string) => {
    setEditingDayId(dayId);
    setEditBuffer(currentText);
  };

  const handleSaveEdit = (dayId: number) => {
    onSaveEntry(dayId, editBuffer);
    setEditingDayId(null);
    setSaveToast(dayId);
    setTimeout(() => setSaveToast(null), 2000);
  };

  const handleExportAll = () => {
    if (entries.length === 0) {
      alert("Aún no tienes anotaciones grabadas en tu diario.");
      return;
    }

    let compiledText = `==================================================\n`;
    compiledText += `    DIARIO ESPIRITUAL - EL COFRE DEL PADRE BENJAMÍN\n`;
    compiledText += `    Jornada de Siete Días • Guardado de forma Privada\n`;
    compiledText += `    Fecha de Exportación: ${new Date().toLocaleDateString()}\n`;
    compiledText += `==================================================\n\n`;

    DAYS_CONTENT.forEach((day) => {
      const entry = entries.find((e) => e.dayId === day.dayId);
      compiledText += `--------------------------------------------------\n`;
      compiledText += `DÍA ${day.dayId}: ${day.title} (${day.theme})\n`;
      compiledText += `Pregunta de Reflexión:\n"${day.question}"\n\n`;
      compiledText += `Tu Anotación:\n`;
      if (entry && entry.text.trim()) {
        compiledText += `${entry.text.trim()}\n`;
        compiledText += `(Modificado el: ${new Date(entry.updatedAt).toLocaleString()})\n`;
      } else {
        compiledText += `[Sin anotación registrada]\n`;
      }
      compiledText += `--------------------------------------------------\n\n`;
    });

    compiledText += `==================================================\n`;
    compiledText += `Soli Deo Gloria 🙏 El final es solo un nuevo camino.\n`;
    compiledText += `==================================================\n`;

    const blob = new Blob([compiledText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diario_padre_benjamin_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalWritten = entries.filter((e) => e.text.trim().length > 0).length;

  return (
    <div className="space-y-6 text-white pb-10">
      
      {/* Header and export trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-serif font-bold text-gold-400 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold-400" />
            Mi Diario Espiritual
          </h3>
          <p className="text-xs text-slate-400">
            {totalWritten === 0 
              ? "Tus pensamientos y oraciones íntimas se compilarán aquí."
              : `Has completado anotaciones en ${totalWritten} de 7 días.`}
          </p>
        </div>

        {totalWritten > 0 && (
          <button
            id="btn-export-journal"
            onClick={handleExportAll}
            className="self-start sm:self-center bg-gold-500 hover:bg-gold-600 text-black font-bold text-[10px] uppercase tracking-wider py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar Diario (.TXT)
          </button>
        )}
      </div>

      {/* Diary Card loop */}
      <div className="space-y-4">
        {DAYS_CONTENT.map((day) => {
          const entry = entries.find((e) => e.dayId === day.dayId);
          const hasText = entry && entry.text.trim().length > 0;
          const isEditing = editingDayId === day.dayId;

          return (
            <div
              id={`journal-day-block-${day.dayId}`}
              key={day.dayId}
              className={`bg-slate-900/40 border rounded-2xl p-4 transition-all ${
                hasText 
                  ? "border-gold-500/20 shadow-xs bg-gradient-to-br from-slate-900/70 to-slate-950/40" 
                  : "border-slate-800/60 opacity-60 hover:opacity-80"
              }`}
            >
              
              {/* Header inside card */}
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <span className="text-[9px] font-bold text-gold-400 uppercase tracking-widest font-mono">
                    Día {day.dayId} • {day.theme}
                  </span>
                  <h4 className="text-xs font-bold text-slate-200 mt-0.5 font-serif">
                    {day.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1">
                  {!hasText && !isEditing ? (
                    <button
                      id={`btn-start-diary-${day.dayId}`}
                      onClick={() => onNavigateToDay(day.dayId)}
                      className="text-[10px] text-slate-400 hover:text-gold-400 hover:underline font-bold transition-all shrink-0"
                    >
                      Escribir
                    </button>
                  ) : !isEditing ? (
                    <div className="flex items-center gap-1 shrink-0">
                      {copiedId === day.dayId ? (
                        <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5 mr-1">
                          <Check className="w-3 h-3" /> Copiado
                        </span>
                      ) : (
                        <button
                          id={`btn-copy-diary-${day.dayId}`}
                          onClick={() => handleCopy(day.dayId, entry?.text || "")}
                          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
                          title="Copiar anotación"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      <button
                        id={`btn-edit-diary-${day.dayId}`}
                        onClick={() => handleStartEdit(day.dayId, entry?.text || "")}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
                        title="Editar anotación"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`btn-delete-diary-${day.dayId}`}
                        onClick={() => {
                          if (window.confirm("¿Seguro que deseas eliminar esta anotación del diario?")) {
                            onDeleteEntry(day.dayId);
                          }
                        }}
                        className="p-1 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400"
                        title="Borrar anotación"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Question label */}
              <p className="text-[10px] italic text-slate-400 mb-3 border-l border-gold-500/20 pl-2">
                "{day.question}"
              </p>

              {/* Editable TextArea vs Normal View */}
              {isEditing ? (
                <div className="space-y-2 mt-2">
                  <textarea
                    id={`journal-textarea-edit-${day.dayId}`}
                    rows={3}
                    value={editBuffer}
                    onChange={(e) => setEditBuffer(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-gold-500/30 text-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                    placeholder="Sintoniza tu respiración y graba tu sentir..."
                  />
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-gold-400" />
                      Guardado seguro en este dispositivo
                    </span>
                    <div className="flex gap-2">
                      <button
                        id={`btn-cancel-edit-diary-${day.dayId}`}
                        onClick={() => setEditingDayId(null)}
                        className="px-2.5 py-1 hover:bg-slate-800 rounded-md text-slate-400"
                      >
                        Cancelar
                      </button>
                      <button
                        id={`btn-save-edit-diary-${day.dayId}`}
                        onClick={() => handleSaveEdit(day.dayId)}
                        className="px-2.5 py-1 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-md flex items-center gap-1"
                      >
                        <Save className="w-3 h-3" /> Guardar
                      </button>
                    </div>
                  </div>
                </div>
              ) : hasText ? (
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-200 leading-relaxed font-serif whitespace-pre-wrap bg-slate-950/35 p-3 rounded-xl border border-slate-900">
                    {entry?.text}
                  </p>
                  
                  <div className="flex justify-between items-center text-[9px] text-slate-500 px-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-gold-400" />
                      Tu reflexión fue guardada en este dispositivo
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(entry?.updatedAt || "").toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-3 text-center text-[10px] text-slate-500 italic">
                  Aún no has escrito tus oraciones para este día. Abre el manuscrito para meditar y responder.
                </div>
              )}

              {saveToast === day.dayId && (
                <div className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" />
                  Anotación sincronizada y guardada en localStorage
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
