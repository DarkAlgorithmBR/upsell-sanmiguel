import React, { useState, useEffect } from "react";
import { BookOpen, ZoomIn, ZoomOut, Maximize2, Minimize2, Sparkles, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import { DAYS_CONTENT } from "../data/journeyContent";

interface PdfViewerProps {
  dayId: number;
  pdfPath: string;
  title: string;
  reflectionText: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function PdfViewer({ 
  dayId, 
  title, 
  isFavorite, 
  onToggleFavorite 
}: PdfViewerProps) {
  // Zoom levels representing font size in pixels (with proportional line-heights)
  const ZOOM_LEVELS = [
    { label: "Pequeño", px: 15, leading: 1.6 },
    { label: "Normal", px: 17, leading: 1.7 },
    { label: "Grande", px: 20, leading: 1.75 },
    { label: "Extra", px: 23, leading: 1.8 }
  ];
  
  const [zoomIndex, setZoomIndex] = useState(1); // Default to index 1 (17px, highly readable on mobile)
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load the last read page from localStorage for this specific day
  const [currentPage, setCurrentPage] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("el_cofre_last_read_pages");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed[dayId] || 1;
      }
    } catch (e) {
      console.error("No se pudo cargar la última página de la sesión.", e);
    }
    return 1;
  });

  // Save the current page to localStorage whenever it changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem("el_cofre_last_read_pages") || "{}";
      const parsed = JSON.parse(saved);
      parsed[dayId] = currentPage;
      localStorage.setItem("el_cofre_last_read_pages", JSON.stringify(parsed));
    } catch (e) {
      console.error("No se pudo guardar el progreso de lectura.", e);
    }
  }, [currentPage, dayId]);

  // Retrieve the 3 pages of manuscript text from our data store
  const dayData = DAYS_CONTENT.find((d) => d.dayId === dayId);
  const pages = dayData?.manuscriptPages || [];
  
  // Safe boundary check
  const activePageData = pages[currentPage - 1] || pages[0] || { heading: "Sin Contenido", body: "" };

  const handleZoomIn = () => {
    if (zoomIndex < ZOOM_LEVELS.length - 1) {
      setZoomIndex((prev) => prev + 1);
    }
  };

  const handleZoomOut = () => {
    if (zoomIndex > 0) {
      setZoomIndex((prev) => prev - 1);
    }
  };

  const activeZoom = ZOOM_LEVELS[zoomIndex];

  return (
    <div 
      id={`manuscript-viewer-day-${dayId}`}
      className={`bg-[#fcf8f2] text-[#3d2c16] rounded-2xl border-2 border-[#e6d0b3] shadow-xl flex flex-col overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? "fixed inset-0 z-50 p-4 lg:p-8 bg-[#1a120b]" 
          : "min-h-[420px] w-full"
      }`}
    >
      
      {/* Viewer Header */}
      <header className="bg-[#f5ebd8] px-4 py-3 border-b border-[#e6d0b3] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <BookOpen className="w-4 h-4 text-[#8a6231] shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8a6231] block font-mono">
              MANUSCRITO INTERACTIVO
            </span>
            <span className="text-xs font-serif font-bold text-[#523d26] truncate block">
              {title}
            </span>
          </div>
        </div>

        {/* Top Controls Toolbar */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Zoom Out Button */}
          <button
            id={`btn-zoom-out-${dayId}`}
            onClick={handleZoomOut}
            disabled={zoomIndex === 0}
            className="p-1.5 rounded-lg hover:bg-white/60 text-[#694d2c] transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Reducir tamaño del texto"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          <span className="text-[10px] font-mono font-bold text-[#694d2c] bg-white/40 px-2 py-0.5 rounded border border-[#dfceb5]">
            {activeZoom.px}px
          </span>
          
          {/* Zoom In Button */}
          <button
            id={`btn-zoom-in-${dayId}`}
            onClick={handleZoomIn}
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            className="p-1.5 rounded-lg hover:bg-white/60 text-[#694d2c] transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Aumentar tamaño del texto"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-[#e6d0b3] mx-1" />

          {/* Optional Favorite Toggle Button (Option Guardar Manuscrito) */}
          {onToggleFavorite && (
            <button
              id={`btn-fav-inside-viewer-${dayId}`}
              onClick={onToggleFavorite}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isFavorite
                  ? "bg-[#8a6231]/15 text-[#8a6231]"
                  : "hover:bg-white/60 text-[#694d2c]"
              }`}
              title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? "fill-[#8a6231]" : ""}`} />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            id={`btn-toggle-fullscreen-${dayId}`}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg hover:bg-white/60 text-[#694d2c] transition-all cursor-pointer"
            title={isFullscreen ? "Minimizar pantalla" : "Pantalla Completa"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Parchment Book Stage */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-center relative custom-scrollbar bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#fffbf5] via-[#fbf6ec] to-[#f3ebd8]">
        {/* Ancient book pattern decoration background lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(138,98,49,0.02)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none" />

        {/* Scroll Page Body */}
        <div 
          className="w-full max-w-xl bg-[#faf6ed] p-6 lg:p-10 rounded-xl shadow-md border border-[#dfceb5] relative transition-all duration-200 text-center space-y-5"
          style={{ 
            fontSize: `${activeZoom.px}px`, 
            lineHeight: activeZoom.leading 
          }}
        >
          {/* Top mystical visual ceremonial mark */}
          <div className="flex justify-center items-center gap-2 text-[#8a6231] opacity-75 select-none shrink-0">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#8a6231]" />
            <span className="font-serif text-sm font-extrabold tracking-widest px-1">☨</span>
            <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#8a6231]" />
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>

          {/* Heading of active page */}
          <h4 className="font-serif font-extrabold text-[#8a6231] uppercase tracking-widest text-[13px] md:text-sm mt-1">
            {activePageData.heading}
          </h4>

          {/* Ancient drop cap styled paragraph */}
          <p 
            className="text-[#4e3a24] text-justify font-serif selection:bg-[#8a6231]/20 select-text transition-all duration-150
              first-letter:text-5xl first-letter:font-serif first-letter:font-extrabold first-letter:text-[#8a6231] 
              first-letter:float-left first-letter:mr-3 first-letter:mt-1"
          >
            {activePageData.body}
          </p>

          {/* Golden footer separator */}
          <div className="h-[1.5px] w-28 bg-[#dfceb5] mx-auto mt-8 select-none" />
        </div>
      </div>

      {/* Reader Footer Controls */}
      <footer className="bg-[#f5ebd8] px-5 py-3.5 border-t border-[#e6d0b3] flex justify-between items-center text-xs text-[#8a6231] font-bold shrink-0">
        <button
          id={`btn-prev-page-${dayId}`}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 hover:text-[#523d26] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all uppercase tracking-wide text-[10px]"
        >
          <ChevronLeft className="w-4 h-4" />
          Atrás
        </button>

        <span className="font-serif tracking-wider font-extrabold text-[11px] md:text-xs">
          Página {currentPage} de 3
        </span>

        <button
          id={`btn-next-page-${dayId}`}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, 3))}
          disabled={currentPage === 3}
          className="flex items-center gap-1.5 hover:text-[#523d26] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all uppercase tracking-wide text-[10px]"
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
