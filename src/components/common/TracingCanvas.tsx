import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, Sparkles, Volume2 } from 'lucide-react';
import { sound } from '../../utils/audio';

interface TracingCanvasProps {
  letter: string;
  guideText?: string;
  isUrdu?: boolean;
  onComplete: () => void;
  color?: string;
}

export const TracingCanvas: React.FC<TracingCanvasProps> = ({
  letter,
  guideText,
  isUrdu = false,
  onComplete,
  color = '#EC4899',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [selectedColor, setSelectedColor] = useState(color);

  const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    drawBackground();
  }, [letter, isUrdu]);

  const drawBackground = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw background guide grid (notebook lines)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);

    // Top line, midline, baseline
    const h = rect.height;
    const w = rect.width;
    [h * 0.25, h * 0.5, h * 0.75].forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    });

    ctx.setLineDash([]); // Reset dash

    // Draw Ghost / Guide Letter in dotted gray
    ctx.fillStyle = '#CBD5E1';
    ctx.font = isUrdu
      ? `bold ${h * 0.55}px "Noto Sans Arabic", "Gulzar", sans-serif`
      : `bold ${h * 0.55}px "Fredoka", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, w / 2, h / 2 + (isUrdu ? -10 : 10));

    // Outer outline stroke for guide
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(letter, w / 2, h / 2 + (isUrdu ? -10 : 10));
    ctx.setLineDash([]);
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    sound.playPop();
    const pos = getPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);

    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedColor;
    ctx.shadowColor = selectedColor;
    ctx.shadowBlur = 8;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setStrokeCount((prev) => prev + 1);
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const handleClear = () => {
    sound.playPop();
    setStrokeCount(0);
    drawBackground();
  };

  const handleFinish = () => {
    if (strokeCount < 10) {
      sound.playFriendlyBoing();
      sound.speak("Trace with your finger first! You can do it!", { rate: 0.9 });
      return;
    }
    sound.playSuccess();
    onComplete();
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-amber-300 max-w-md w-full mx-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between w-full mb-3">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">
            Tracing Studio
          </span>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            {guideText || 'Follow the dashed line with your finger!'}
          </p>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Interactive Tracing Canvas */}
      <div className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden border-4 border-dashed border-amber-300 bg-amber-50/40 shadow-inner">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {strokeCount === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[0.5px]">
            <span className="bg-white/90 text-amber-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-md animate-bounce">
              👆 Touch & Trace {letter}!
            </span>
          </div>
        )}
      </div>

      {/* Color Palette Picker */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => {
              setSelectedColor(c);
              sound.playPop();
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform ${
              selectedColor === c ? 'scale-125 border-slate-900 shadow-md ring-2 ring-amber-300' : 'border-white hover:scale-110'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Done / Check button */}
      <button
        onClick={handleFinish}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-extrabold text-base sm:text-lg py-3 rounded-2xl shadow-lg border-b-4 border-green-700 active:translate-y-1 transition"
      >
        <Check className="w-6 h-6 stroke-[3]" />
        <span>I Finished Tracing! ⭐</span>
      </button>
    </div>
  );
};
