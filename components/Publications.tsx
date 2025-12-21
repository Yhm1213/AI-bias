
import React from 'react';
import { PUBLICATIONS } from '../constants';

const Publications: React.FC = () => {
  return (
    <section id="publications" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">代表性学术论文</h2>
          <p className="text-slate-500">在顶级期刊和国际会议上分享最新的研究发现</p>
        </div>

        <div className="space-y-6">
          {PUBLICATIONS.map((pub) => (
            <div key={pub.id} className="group p-8 border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition duration-300">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex gap-2">
                    {pub.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-medium rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {pub.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    {pub.authors.join(', ')} — <span className="text-slate-900 italic">{pub.journal}</span>, {pub.year}
                  </p>
                  <p className="text-slate-600 line-clamp-2">
                    {pub.abstract}
                  </p>
                </div>
                <div className="flex shrink-0 gap-3">
                  {pub.doi && (
                    <a 
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition"
                      title="View DOI"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </a>
                  )}
                  <button className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition" title="Read Abstract">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;
