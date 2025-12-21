
import React from 'react';
import { RESEARCHER_NAME, RESEARCHER_TITLE, BIO } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase">
            欢迎来到我的学术主页
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
            {RESEARCHER_NAME}
          </h1>
          <p className="text-xl text-blue-600 font-medium">{RESEARCHER_TITLE}</p>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
            {BIO}
          </p>
          <div className="flex space-x-4">
            <a href="#publications" className="px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition">
              查看论文
            </a>
            <a href="#projects" className="px-8 py-3 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition">
              研究项目
            </a>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/researcher/800/800" 
              alt="Researcher Portrait" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
