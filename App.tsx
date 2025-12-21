
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Publications from './components/Publications';
import Projects from './components/Projects';
import Stats from './components/Stats';
import AIAssistant from './components/AIAssistant';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnter = () => {
    // 可以在这里添加转场动画逻辑
    setHasEntered(true);
    window.scrollTo(0, 0);
  };

  if (!hasEntered) {
    return <LandingPage onEnter={handleEnter} />;
  }

  return (
    <div className="relative min-h-screen bg-slate-50 animate-fade-in">
      <Header />
      
      <main>
        <Hero />
        
        {/* About Section - Simple Layout */}
        <section id="about" className="py-24 max-w-7xl mx-auto px-6 border-t border-slate-100">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">研究哲学</h2>
              <div className="w-12 h-1 bg-blue-600 mb-6"></div>
              <p className="text-slate-600 italic">
                “我认为科学的进步不应仅仅局限于实验室，而是通过 AI 赋能人类，去解决现实世界中最棘手的问题。”
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-600 leading-relaxed">
                在过去十年中，我一直专注于机器学习与自然语言处理的交集。我的研究涉及从基础理论架构到大规模部署的各个方面。
                我特别感兴趣的是如何让机器具备像人类一样的组合泛化能力，以及如何在受限环境下实现更高效的算力利用。
              </p>
            </div>
          </div>
        </section>

        <Publications />
        <Projects />
        <Stats />
      </main>

      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <p>© 2024 Research Portfolio. 由 React & Gemini AI 强力驱动.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-600 transition">Google Scholar</a>
            <a href="#" className="hover:text-blue-600 transition">GitHub</a>
            <a href="#" className="hover:text-blue-600 transition">LinkedIn</a>
            <a href="#" className="hover:text-blue-600 transition">Email</a>
          </div>
        </div>
      </footer>

      {/* 智能助理 */}
      <AIAssistant />
    </div>
  );
};

export default App;
