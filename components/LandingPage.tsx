
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const { t } = useTranslation();
  const [displayText, setDisplayText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const fullText = t('home.landing_typing');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setIsFinished(true);
      }
    }, 120); // 打字速度

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[999] flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="max-w-3xl w-full flex flex-col items-center">
        <div className="font-mono text-xl md:text-3xl text-green-500 leading-relaxed mb-12 min-h-[5rem] text-center w-full">
          {displayText.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < displayText.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
          <span className="inline-block w-3 h-1 bg-green-500 ml-1 animate-cursor align-middle -translate-y-1"></span>
        </div>

        {isFinished && (
          <div className="animate-fade-in opacity-0 flex justify-center mt-4">
            <button 
              onClick={onEnter}
              className="group relative px-12 py-3 bg-transparent border border-green-500 text-green-500 font-mono text-lg uppercase tracking-widest hover:bg-green-500/10 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 group-hover:scale-110 transition-transform inline-block">{t('home.landing_button')}</span>
              <div className="absolute inset-0 bg-green-500/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
