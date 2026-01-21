import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, X, Loader2, Wand2, Check } from 'lucide-react';

const AiPosterModal = ({ isOpen, onClose, onApply }) => {
  const [style, setStyle] = useState('vibrant');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
    setTimeout(() => {
      const collection = posterCollections[style];
      const randomImg = collection[Math.floor(Math.random() * collection.length)];
      setSelectedImage(randomImg);
      setIsGenerating(false);
    }, 1500);
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
