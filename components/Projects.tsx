
import React from 'react';
import { PROJECTS } from '../constants';

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">核心科研项目</h2>
          <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <div key={project.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-500 border border-slate-100 flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                    project.status === 'Ongoing' ? 'bg-orange-100 text-orange-600' : 
                    project.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {project.status === 'Ongoing' ? '研究中' : project.status === 'Completed' ? '已结项' : '提议中'}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{project.name}</h3>
                  <p className="text-slate-600 mb-6">{project.description}</p>
                </div>
                <button className="text-blue-600 font-semibold flex items-center hover:translate-x-2 transition w-fit">
                  详情介绍
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
