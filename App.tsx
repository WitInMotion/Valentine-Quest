
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QUESTIONS, NO_MESSAGES } from './constants';
import { ButtonPosition } from './types';
import confetti from 'canvas-confetti';
import { Heart, Stars, Trash2, Ghost, Smile, AlertCircle } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(0);
  const [isCelebration, setIsCelebration] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [noButtonPos, setNoButtonPos] = useState<ButtonPosition>({ top: 'auto', left: 'auto' });
  const [isNoButtonAbsolute, setIsNoButtonAbsolute] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentQuestion = QUESTIONS[step];

  const handleYes = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(prev => prev + 1);
      // Reset NO button for next question
      setIsNoButtonAbsolute(false);
      setNoButtonPos({ top: 'auto', left: 'auto' });
    } else {
      triggerCelebration();
    }
  };

  const triggerCelebration = () => {
    setIsCelebration(true);
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleNo = () => {
    const randomMsg = NO_MESSAGES[Math.floor(Math.random() * NO_MESSAGES.length)];
    setModalMessage(randomMsg);
    moveNoButton();
  };

  const moveNoButton = useCallback(() => {
    if (!cardRef.current) return;

    const padding = 20;
    const btnWidth = 100;
    const btnHeight = 50;

    // Use viewport or relative to container? 
    // Let's go chaotic and use the full screen but keep it visible
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    const randomX = Math.max(padding, Math.random() * maxX);
    const randomY = Math.max(padding, Math.random() * maxY);

    setIsNoButtonAbsolute(true);
    setNoButtonPos({
      top: `${randomY}px`,
      left: `${randomX}px`
    });
  }, []);

  if (isCelebration) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-wrap gap-10 justify-center content-center">
            {Array.from({length: 20}).map((_, i) => (
                <Heart key={i} size={48} className="text-pink-400 animate-bounce" style={{animationDelay: `${i * 0.2}s`}} fill="currentColor" />
            ))}
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-lg w-full relative z-10 border-4 border-pink-200 animate-bounce">
          <div className="flex justify-center mb-6">
            <div className="bg-pink-100 p-4 rounded-full">
              <Heart size={64} className="text-pink-500" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-6">YAY! ❤️</h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            My heart is officially yours! Get ready for the best Valentine's Day ever. I'm so happy you said YES!
          </p>
          <div className="space-y-4">
             <div className="flex justify-center gap-2 text-pink-500">
                <Stars /> <Stars /> <Stars />
             </div>
             <p className="italic text-gray-500">I knew you couldn't resist my charm (and this glitchy app).</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-pink-50 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Decor */}
      <div className="absolute top-10 left-10 text-pink-200 rotate-12 pointer-events-none">
        <Heart size={80} fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 text-pink-200 -rotate-12 pointer-events-none">
        <Heart size={100} fill="currentColor" />
      </div>

      {/* Main Card */}
      <div 
        ref={cardRef}
        className="bg-white rounded-3xl shadow-xl p-6 md:p-10 max-w-md w-full text-center border-b-8 border-pink-100 transition-all transform hover:scale-[1.01]"
      >
        <div className="mb-6 relative overflow-hidden rounded-2xl h-48 bg-gray-100 border-2 border-pink-50">
          <img 
            src={currentQuestion.image} 
            alt="Question illustration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-pink-600 shadow-sm">
            Question {step + 1} of {QUESTIONS.length}
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 min-h-[4rem] flex items-center justify-center">
          {currentQuestion.text}
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative min-h-[60px]">
          <button
            onClick={handleYes}
            className="w-full sm:w-32 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <Smile className="group-hover:animate-bounce" />
            YES
          </button>

          <button
            onClick={handleNo}
            onMouseEnter={() => {
                // If it's the final question, make it harder!
                if (step === QUESTIONS.length - 1) moveNoButton();
            }}
            style={isNoButtonAbsolute ? { position: 'fixed', ...noButtonPos, zIndex: 1000 } : {}}
            className={`${
                isNoButtonAbsolute ? 'w-32' : 'w-full sm:w-32'
            } bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 group`}
          >
            <AlertCircle className="group-hover:rotate-12" />
            NO
          </button>
        </div>

        <div className="mt-8 text-pink-300 flex justify-center gap-1">
            {QUESTIONS.map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i === step ? 'bg-pink-500 w-6' : 'bg-pink-200'} transition-all`} />
            ))}
        </div>
      </div>

      {/* Modal Overlay */}
      {modalMessage && (
        <div className="fixed inset-0 bg-pink-900/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xs w-full shadow-2xl text-center border-4 border-pink-400 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-4 text-pink-500">
               <Ghost size={48} className="animate-pulse" />
            </div>
            <p className="text-lg font-bold text-gray-700 mb-6">{modalMessage}</p>
            <button
              onClick={() => setModalMessage(null)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-8 rounded-full shadow-md transition-colors"
            >
              Okay, sowwy...
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
