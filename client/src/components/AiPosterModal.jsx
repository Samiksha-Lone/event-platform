import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, X, Loader2, Wand2, Check } from 'lucide-react';

const AiPosterModal = ({ isOpen, onClose, onApply, title = '', description = '' }) => {
  const [style, setStyle] = useState('vibrant');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [inputTitle, setInputTitle] = useState(title || '');
  const [inputSubtitle, setInputSubtitle] = useState(description || '');

  if (!isOpen) return null;

  const posterCollections = {
    vibrant: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540575861501-7c91b177a296?auto=format&fit=crop&q=80&w=800',
    ],
    minimal: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1514525253361-bee8d41dfb7a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=800',
    ],
    professional: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
    ],
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setSelectedImage(null);

    const collection = posterCollections[style];
    const bgUrl = collection[Math.floor(Math.random() * collection.length)];

    // Create a canvas-based poster so the output is unique per title/description
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = bgUrl;
    img.onload = () => {
      try {
        const w = 1200;
        const h = 675;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        // draw background image covering canvas
        const iw = img.width;
        const ih = img.height;
        const scale = Math.max(w / iw, h / ih);
        const sw = iw * scale;
        const sh = ih * scale;
        const sx = (w - sw) / 2;
        const sy = (h - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh);

        // overlay gradient for better text contrast
        const grad = ctx.createLinearGradient(0, h, 0, h * 0.45);
        grad.addColorStop(0, 'rgba(0,0,0,0.65)');
        grad.addColorStop(1, 'rgba(0,0,0,0.0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, h * 0.45, w, h * 0.55);

        // draw title
        const titleText = inputTitle || 'Your Event Title';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.lineWidth = 6;
        ctx.font = 'bold 56px Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial';
        // soft shadow
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 12;
        // wrap title into two lines if too long
        const wrapText = (text, x, y, maxWidth, lineHeight) => {
          const words = text.split(' ');
          let line = '';
          let curY = y;
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
              ctx.fillText(line.trim(), x, curY);
              line = words[n] + ' ';
              curY += lineHeight;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line.trim(), x, curY);
          return curY;
        };

        const padding = 64;
        ctx.font = 'bold 56px Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 16;
        const lastY = wrapText(titleText, padding, h - 180, w - padding * 2, 66);

        // draw subtitle
        if (inputSubtitle) {
          ctx.shadowBlur = 10;
          ctx.font = '400 28px Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial';
          ctx.fillStyle = 'rgba(255,255,255,0.92)';
          wrapText(inputSubtitle, padding, lastY + 36, w - padding * 2, 38);
        }

        // small watermark
        ctx.shadowBlur = 0;
        ctx.font = '500 14px Inter, system-ui';
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText('EventHub • AI Poster', w - 220, h - 20);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setSelectedImage(dataUrl);
      } catch (err) {
        // fallback to background URL
        setSelectedImage(bgUrl);
      } finally {
        setIsGenerating(false);
      }
    };

    img.onerror = () => {
      setSelectedImage(bgUrl);
      setIsGenerating(false);
    };
  };

  const handleApply = () => {
    if (selectedImage) {
      onApply(selectedImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl overflow-hidden duration-300 bg-white border shadow-2xl dark:bg-neutral-900 rounded-2xl border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95">
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800 bg-indigo-50/50 dark:bg-indigo-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2 text-white bg-indigo-600 shadow-lg rounded-xl shadow-indigo-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">AI Poster Studio</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Generate stunning event banners instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="block mb-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Poster Title
              </label>
              <input
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="Event title (e.g. React Hack Night)"
                className="w-full px-4 py-2.5 text-sm bg-white border-2 border-neutral-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Subtitle / Short description
              </label>
              <input
                value={inputSubtitle}
                onChange={(e) => setInputSubtitle(e.target.value)}
                placeholder="Optional: date, location, short hook"
                className="w-full px-4 py-2.5 text-sm bg-white border-2 border-neutral-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-xs font-black tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                Choose Aesthetic Style
              </label>
              <div className="space-y-2">
                {['Vibrant', 'Minimal', 'Professional'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s.toLowerCase())}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all group ${style === s.toLowerCase()
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                        : 'border-neutral-100 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400 hover:border-neutral-200 dark:hover:border-neutral-700'
                      }`}
                  >
                    <span>{s}</span>
                    <div className={`w-2 h-2 rounded-full transition-all ${style === s.toLowerCase() ? 'bg-indigo-600 scale-125' : 'bg-neutral-300 dark:bg-neutral-600'
                      }`} />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="group relative flex items-center justify-center w-full gap-2 px-6 py-4 text-base font-black text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Synthesizing Art...</span>
                </>
              ) : (
                <>
                  <Wand2 size={20} className="transition-transform group-hover:rotate-12" />
                  <span>Generate magic Poster</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50 relative overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <div className="p-4 bg-indigo-100 rounded-full dark:bg-indigo-900/30">
                  <ImageIcon size={32} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-neutral-500">Creating your masterpiece...</p>
              </div>
            ) : selectedImage ? (
              <div className="w-full h-full duration-700 animate-in zoom-in-110">
                <img
                  src={selectedImage}
                  alt="Generated Poster"
                  className="object-cover w-full h-full rounded-xl"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <button
                    onClick={handleApply}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-indigo-600 rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-50 transition-colors"
                  >
                    <Check size={18} />
                    Perfect, use this!
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <ImageIcon size={48} className="mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                  Select a style and click generate to see the magic.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t bg-neutral-50 dark:bg-neutral-900/50 border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-1">
            <Sparkles size={10} /> Powered by EventHub Creative AI
          </span>
          {selectedImage && (
            <button
              onClick={() => setSelectedImage(null)}
              className="text-xs font-bold transition-colors text-neutral-500 hover:text-red-500"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiPosterModal;
