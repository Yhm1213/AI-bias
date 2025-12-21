
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tight text-blue-600">RESEARCH.LAB</div>
        <div className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-widest">
          <a href="#about" className="hover:text-blue-600 transition">关于我</a>
          <a href="#publications" className="hover:text-blue-600 transition">论文成果</a>
          <a href="#projects" className="hover:text-blue-600 transition">科研项目</a>
          <a href="#stats" className="hover:text-blue-600 transition">影响力</a>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          联系合作
        </button>
      </div>
    </nav>
  );
};

export default Header;
