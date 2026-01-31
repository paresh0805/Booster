
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell
} from 'recharts';
import { ScoreEntry, AssessmentType } from '../types';

interface AssessmentData {
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
}

const COLORS: Record<string, string> = {
  [AssessmentType.IA1]: '#6366f1', // Indigo
  [AssessmentType.IA2]: '#8b5cf6', // Violet
  [AssessmentType.TW]: '#10b981', // Emerald
  [AssessmentType.ESE]: '#f43f5e', // Rose
  [AssessmentType.ORAL_PRAC]: '#f59e0b', // Amber
};

export const IndividualAssessmentChart: React.FC<{ scores: ScoreEntry[], type: AssessmentType }> = React.memo(({ scores, type }) => {
  const filtered = scores.filter(s => s.type === type);
  
  const data: AssessmentData[] = filtered.map(s => ({
    subject: s.subject.length > 15 ? s.subject.substring(0, 12) + '...' : s.subject,
    score: s.score,
    maxScore: s.maxScore,
    percentage: (s.score / s.maxScore) * 100
  }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-72 group transition-all hover:shadow-md" style={{ minWidth: 0 }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{type}</h3>
          <p className="text-sm font-black text-gray-900 italic">Module Analytics</p>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: COLORS[type] + '20', color: COLORS[type] }}>
           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[type] }}></div>
        </div>
      </div>
      <div className="flex-1" style={{ minHeight: 0, minWidth: 0 }}>
        {/* Use explicit pixel height to avoid Recharts dimension warnings */}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -35, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="subject" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
            />
            <YAxis 
              domain={[0, 100]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 9 }} 
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[type]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export const PerformanceTrajectory: React.FC<{ scores: ScoreEntry[] }> = React.memo(({ scores }) => {
  const sorted = [...scores].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const data = sorted.reduce((acc: any[], curr) => {
    const scorePct = (curr.score / curr.maxScore) * 100;
    const existingDate = acc.find(p => p.date === curr.date);
    if (existingDate) {
      existingDate.average = (existingDate.average + scorePct) / 2;
    } else {
      acc.push({ date: curr.date, average: scorePct });
    }
    return acc;
  }, []);

  return (
    <div className="h-96 w-full bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100" style={{ minWidth: 0 }}>
      <div className="mb-8">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Master Growth Curve</h3>
        <p className="text-2xl font-black text-gray-900 italic tracking-tighter">Academic Velocity</p>
      </div>
      {/* Use a fixed pixel height so the container is measurable at mount */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
            tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip 
            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="average" 
            stroke="#4f46e5" 
            strokeWidth={6} 
            fillOpacity={1} 
            fill="url(#colorAvg)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
