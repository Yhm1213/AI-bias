
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { METRICS } from '../constants';

const Stats: React.FC = () => {
  return (
    <section id="stats" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">科研影响力与领域专长</h2>
            <p className="text-lg text-slate-600">
              通过多年的学术积累，我在人工智能的多个细分领域建立了深厚的知识储备。以下是基于项目经验与论文发表的技术领域雷达图。
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-blue-50 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600">20+</div>
                <div className="text-sm text-slate-600 uppercase font-semibold">发表论文</div>
              </div>
              <div className="p-6 bg-indigo-50 rounded-2xl">
                <div className="text-3xl font-bold text-indigo-600">1.2k</div>
                <div className="text-sm text-slate-600 uppercase font-semibold">被引用次数</div>
              </div>
              <div className="p-6 bg-purple-50 rounded-2xl">
                <div className="text-3xl font-bold text-purple-600">5+</div>
                <div className="text-sm text-slate-600 uppercase font-semibold">发明专利</div>
              </div>
              <div className="p-6 bg-emerald-50 rounded-2xl">
                <div className="text-3xl font-bold text-emerald-600">12</div>
                <div className="text-sm text-slate-600 uppercase font-semibold">审稿期刊</div>
              </div>
            </div>
          </div>
          
          <div className="h-[500px] w-full glass rounded-3xl p-8 shadow-xl border border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={METRICS}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                <Radar
                  name="Proficiency"
                  dataKey="value"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
