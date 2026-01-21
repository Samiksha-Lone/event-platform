import React, { useState } from 'react';
import { Sparkles, X, Loader2, Wand2, Check, Copy } from 'lucide-react';
import Button from './Button';

const AiDescriptionModal = ({ isOpen, onClose, onApply }) => {
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!keywords.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const mockResult = `Experience the ultimate ${keywords.split(',')[0] || 'event'}! \n\nThis gathering is specifically designed for those passionate about ${keywords || 'excellence'}. Join us for an unforgettable session filled with networking, learning, and growth. We have curated a unique lineup of activities that ensure every attendee leaves inspired. \n\nDon't miss out on this opportunity to connect with like-minded individuals in a ${tone} atmosphere. Secure your spot today!`;
      setGeneratedText(mockResult);
      setIsGenerating(false);
    }, 2000);
  };

  const handleApply = () => {
    onApply(generatedText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden duration-200 bg-white border shadow-2xl dark:bg-neutral-900 rounded-xl border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800 bg-indigo-50/50 dark:bg-indigo-500/5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <Sparkles size={18} />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">AI Event Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!generatedText ? (
            <>
              <div>
                <label className="block mb-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  What's your event about?
                </label>
                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. React Workshop, beginner friendly, building a task app, 3 hours"
                  className="w-full px-4 py-2.5 text-sm bg-white border-2 border-neutral-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
                />
              </div>

              <div>
                <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-neutral-700 dark:text-neutral-300">
                  Tone of Voice
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Professional', 'Exciting', 'Casual'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t.toLowerCase())}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border-2 transition-all ${tone === t.toLowerCase()
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                          : 'border-neutral-100 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400 hover:border-neutral-200'
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !keywords.trim()}
                className="flex items-center justify-center w-full gap-2 px-6 py-3 text-sm font-bold text-white transition-all bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-indigo-500/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Magically generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    <span>Generate Description</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute -top-3 left-3 px-2 py-0.5 bg-indigo-600 text-[10px] font-black text-white rounded uppercase tracking-widest z-10">
                  AI Draft
                </div>
                <div className="p-4 pt-6 text-sm leading-relaxed border-2 border-indigo-100 rounded-lg bg-indigo-50/30 dark:bg-indigo-900/10 dark:border-indigo-900/50 text-neutral-800 dark:text-neutral-200 min-h-[160px] whitespace-pre-wrap">
                  {generatedText}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setGeneratedText('')}
                  className="flex-1 px-4 py-2.5 text-xs font-bold text-neutral-600 border-2 border-neutral-200 rounded-lg hover:bg-neutral-50 dark:text-neutral-400 dark:border-neutral-800 dark:hover:bg-neutral-800 transition-colors"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Keep & Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 text-center border-t bg-neutral-50 dark:bg-neutral-900/50 border-neutral-100 dark:border-neutral-800">
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-bold">
            Powered by EventHub AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiDescriptionModal;
