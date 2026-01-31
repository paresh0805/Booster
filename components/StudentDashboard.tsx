
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ScoreEntry, Student, PerformanceAnalysis, AssessmentType, Subject } from '../types';
import { PerformanceTrajectory, IndividualAssessmentChart } from './DashboardCharts';
import { analyzePerformance } from '../geminiService';

interface StudentDashboardProps {
  student: Student;
  scores: ScoreEntry[];
  subjects: Subject[];
}

const RPMMeter: React.FC<{ percentage: number, delta: number, creditsRatio: number, studentScores: ScoreEntry[] }> = React.memo(({ percentage, delta, creditsRatio, studentScores }) => {
  const rpm = (percentage / 100) * 8000;
  const rotation = -90 + (percentage * 1.8); 

  const subjectAverages = studentScores.reduce((acc: Record<string, number[]>, curr) => {
    if (!acc[curr.subject]) acc[curr.subject] = [];
    acc[curr.subject].push(curr.score / curr.maxScore);
    return acc;
  }, {});

  const subjectPcts = Object.entries(subjectAverages).map(([name, pcts]) => ({
    name,
    avg: (pcts.reduce((a, b) => a + b, 0) / pcts.length) * 100
  }));

  const weakestSubject = subjectPcts.length > 0 
    ? subjectPcts.reduce((prev, curr) => (prev.avg < curr.avg ? prev : curr))
    : null;

  let stateLabel = "Idle";
  let stateColor = "text-gray-400";
  let stateBg = "bg-gray-400/10";
  let stateAccent = "rose-500";
  let thermalLoad = "Cold";

  if (percentage >= 85) {
    stateLabel = "Redline / Elite";
    stateColor = "text-rose-500";
    stateBg = "bg-rose-500/10";
    stateAccent = "rose-500";
    thermalLoad = "Peak";
  } else if (percentage >= 65) {
    stateLabel = "High Frequency";
    stateColor = "text-indigo-400";
    stateBg = "bg-indigo-400/10";
    stateAccent = "indigo-500";
    thermalLoad = "Stable";
  } else if (percentage >= 40) {
    stateLabel = "Standard Cruise";
    stateColor = "text-emerald-400";
    stateBg = "bg-emerald-400/10";
    stateAccent = "emerald-500";
    thermalLoad = "Warm";
  } else {
    stateLabel = "Cold Start";
    stateColor = "text-amber-500";
    stateBg = "bg-amber-500/10";
    stateAccent = "amber-500";
    thermalLoad = "Critical";
  }

  return (
    <div className="md:col-span-12 bg-gray-950 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white border-t-4 border-indigo-500/50 transition-all duration-700">
      <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="relative w-64 h-64 flex items-center justify-center group">
          <div className="absolute inset-0 rounded-full border-[10px] border-white/5 border-t-indigo-500/30 border-r-indigo-500/30"></div>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
            const angle = -90 + (n * 22.5);
            return (
              <div 
                key={n} 
                className={`absolute text-[10px] font-black ${n >= 7 ? 'text-rose-500/50' : 'text-gray-600'}`}
                style={{ transform: `rotate(${angle}deg) translate(90px) rotate(-${angle}deg)` }}
              >
                {n}
              </div>
            );
          })}
          
          <div className="w-12 h-12 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center z-30">
            <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          </div>
          
          <div 
            className={`absolute bottom-1/2 left-1/2 w-32 h-1 bg-gradient-to-r from-${stateAccent} to-${stateAccent}/40 origin-left z-20 transition-all duration-[1.5s] ease-out shadow-[0_0_20px_rgba(79,70,229,0.4)]`}
            style={{ transform: `rotate(${rotation}deg)` }}
          ></div>

          <div className="absolute bottom-8 flex flex-col items-center">
             <span className={`text-4xl font-black tracking-tighter text-white ${percentage > 85 ? 'animate-pulse' : ''}`}>
               {Math.round(rpm)}
             </span>
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">RPM / Pulse</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className={`inline-flex items-center gap-2 ${stateBg} ${stateColor} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]`}>
               <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 bg-current`}></span>
               </span>
               System: {stateLabel}
            </div>
            <div className="inline-flex items-center gap-2 bg-white/5 text-gray-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
               Thermal Load: <span className={percentage > 80 ? "text-rose-400" : "text-emerald-400"}>{thermalLoad}</span>
            </div>
          </div>
          
          <h2 className="text-4xl font-black tracking-tight leading-none italic uppercase">Academic Drive Engine</h2>
          <p className="text-gray-400 font-medium max-w-lg leading-relaxed text-sm">
            Operating at <span className="text-white font-bold">{percentage}%</span> efficiency. 
            {weakestSubject && weakestSubject.avg < 60 && (
              <span className="block mt-2 text-rose-400 font-bold italic animate-pulse">
                ⚠ COMPONENT ALERT: {weakestSubject.name} is causing significant drag ({Math.round(weakestSubject.avg)}% yield).
              </span>
            )}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
             <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col justify-center">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Fuel (Credits)</p>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-1">
                   <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${creditsRatio * 100}%` }}></div>
                </div>
                <p className="text-xs font-black text-white italic">{Math.round(creditsRatio * 100)}% SEM LOAD</p>
             </div>
             <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Performance Δ</p>
                <p className={`text-xl font-black italic ${delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                   {delta >= 0 ? `+${delta}` : delta}%
                </p>
             </div>
             <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Stability Index</p>
                <p className="text-xl font-black text-white italic">
                   {percentage > 35 ? (delta > -5 ? 'STABLE' : 'TURBULENT') : 'LOW VOLTAGE'}
                </p>
             </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
    </div>
  );
});

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, scores, subjects }) => {
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const studentScores = useMemo(() => scores.filter(s => s.studentId === student.id), [scores, student.id]);
  
  const calculatePointer = useCallback((scoreEntries: ScoreEntry[]) => {
    if (scoreEntries.length === 0) return "0.00";
    const totalWeighted = scoreEntries.reduce((acc, curr) => acc + (curr.score / curr.maxScore * 10 * curr.credits), 0);
    const totalCredits = scoreEntries.reduce((acc, curr) => acc + curr.credits, 0);
    return (totalWeighted / totalCredits).toFixed(2);
  }, []);

  const { sgpi, avgPercentage, delta, creditsRatio, sortedScores, latestEntry, isUp } = useMemo(() => {
    const sgpi = calculatePointer(studentScores);
    const avgPercentage = studentScores.length 
      ? Math.round(studentScores.reduce((acc, curr) => acc + (curr.score / curr.maxScore * 100), 0) / studentScores.length)
      : 0;

    const sortedScores = [...studentScores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestEntry = sortedScores[0];
    
    const delta = sortedScores[0] && sortedScores[1] 
      ? Math.round(((sortedScores[0].score / sortedScores[0].maxScore) - (sortedScores[1].score / sortedScores[1].maxScore)) * 100)
      : 0;

    const totalPossibleCredits = subjects.reduce((acc, s) => acc + s.credits, 0);
    const completedCredits = Array.from(new Set(studentScores.map(s => s.subject)))
      .reduce((acc, subName) => acc + (subjects.find(s => s.name === subName)?.credits || 0), 0);
    const creditsRatio = totalPossibleCredits > 0 ? completedCredits / totalPossibleCredits : 0;

    const isUp = delta >= 0;

    return { sgpi, avgPercentage, delta, creditsRatio, sortedScores, latestEntry, isUp };
  }, [studentScores, subjects, calculatePointer]);

  // Cache AI analysis per student+scores to avoid hitting quota during development
  const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

  const makeCacheKey = (id: string, scoresArr: ScoreEntry[]) => {
    try {
      const s = JSON.stringify(scoresArr.map(s => ({ subject: s.subject, score: s.score, maxScore: s.maxScore, date: s.date })));
      let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
      return `analysis_${id}_${h}`;
    } catch {
      return `analysis_${id}`;
    }
  };

  const getCachedAnalysis = (key: string) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.ts || Date.now() - parsed.ts > CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed;
    } catch { return null; }
  };

  const setCachedAnalysis = (key: string, data: PerformanceAnalysis) => {
    try {
      localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
    } catch { /* ignore */ }
  };

  const fetchAnalysis = async (force = false) => {
    if (studentScores.length === 0) return null;
    const key = makeCacheKey(student.id, studentScores);
    if (!force) {
      const cached = getCachedAnalysis(key);
      if (cached) {
        setAnalysis(cached.data);
        return cached.data;
      }
    }

    try {
      setLoadingAnalysis(true);
      const result = await analyzePerformance(studentScores, student.name);
      setAnalysis(result);
      setCachedAnalysis(key, result);
      return result;
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // On mount, try to load cached analysis only (do not auto-trigger live API call)
  useEffect(() => {
    const key = makeCacheKey(student.id, studentScores);
    const cached = getCachedAnalysis(key);
    if (cached) setAnalysis(cached.data);
  }, [student.id, studentScores.length]);

  const runAnalysis = async () => {
    await fetchAnalysis(true);
  };

  const exportTranscript = () => {
    if (studentScores.length === 0) {
      alert('No transcript data to export.');
      return;
    }
    const rows = studentScores.map(s => [s.date, `"${s.subject.replace(/"/g, '""')}"`, s.type, s.score, s.maxScore, s.credits].join(','));
    const header = ['Date,Subject,Type,Score,MaxScore,Credits'].join(',');
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript_${student.id}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // compute cache preview for UI
  const _cacheKeyNow = makeCacheKey(student.id, studentScores);
  const _cachedEntry = getCachedAnalysis(_cacheKeyNow);
  const _cachedAgoMins = _cachedEntry ? Math.round((Date.now() - _cachedEntry.ts) / 60000) : null;

  return (
    <div className="space-y-8 animate-fadeInUp">
      <header className="space-y-6">
        <div>
          <h1 className="heading-1 text-gray-900 italic mb-2">
            Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{student.name}</span>
          </h1>
          <p className="body-text">
            {student.major} • Roll: <span className="font-bold text-gray-900">{student.id}</span> • Division: <span className="font-bold text-gray-900">{student.classId}</span>
          </p>
        </div>

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SGPI Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Academic Pointer</span>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-4xl font-black text-indigo-900 mb-1">{sgpi}</p>
            <p className="text-xs text-indigo-700 font-bold">out of 10.0 SGPI</p>
          </div>

          {/* Average Percentage */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Performance</span>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-4xl font-black text-emerald-900 mb-1">{avgPercentage}%</p>
            <p className="text-xs text-emerald-700 font-bold">overall average</p>
          </div>

          {/* Credits Progress */}
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-6 border border-violet-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Semester Load</span>
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-4xl font-black text-violet-900 mb-1">{Math.round(creditsRatio * 100)}%</p>
            <p className="text-xs text-violet-700 font-bold">credits completed</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
         <RPMMeter percentage={avgPercentage} delta={delta} creditsRatio={creditsRatio} studentScores={studentScores} />
         
         <div className="md:col-span-4 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between group">
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Latest Component</p>
                <div className="mt-4 flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase truncate">{latestEntry?.subject || "No Data"}</span>
                    <div className="flex items-baseline gap-3">
                        <span className="text-6xl font-black tracking-tighter text-gray-900">{latestEntry?.score || 0}</span>
                        <span className="text-gray-300 font-bold text-xl">/ {latestEntry?.maxScore || 0}</span>
                    </div>
                </div>
            </div>
            <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl w-fit font-black text-sm transition-all ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {isUp ? '✔' : '⚠'} {latestEntry?.type.split(' ')[0] || "Cycle"} Verified
            </div>
         </div>

         <div className="md:col-span-8 bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white flex flex-col justify-center min-h-[250px]">
            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">Pulse AI Analytics</span>
                        <button
                          onClick={runAnalysis}
                          disabled={loadingAnalysis}
                          className="text-[11px] font-bold px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                        >
                          {loadingAnalysis ? 'Running…' : 'Run Pulse AI'}
                        </button>
                        <button
                          onClick={exportTranscript}
                          className="text-[11px] font-bold px-3 py-1 rounded-lg bg-white text-gray-800 border border-white/10 hover:shadow-md transition-all"
                        >
                          Export Transcript
                        </button>
                        {_cachedEntry && (
                          <span className="text-[11px] text-gray-300 bg-white/5 px-2 py-1 rounded-full">Cached { _cachedAgoMins <= 60 ? `${_cachedAgoMins}m` : `${Math.round(_cachedAgoMins/60)}h` } ago</span>
                        )}
                    </div>
                    {analysis?.careerPath && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">Path: {analysis.careerPath}</span>
                    )}
                </div>
                {loadingAnalysis ? (
                    <div className="space-y-3 animate-pulse">
                        <div className="h-6 bg-white/10 rounded-full w-3/4"></div>
                        <div className="h-4 bg-white/10 rounded-full w-1/2"></div>
                    </div>
                ) : (
                    <>
                        <p className="text-2xl font-bold leading-tight tracking-tight italic">
                            {analysis?.summary || "Engine diagnostics pending more academic input cycles."}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {analysis?.recommendations.map((rec, i) => (
                                <span key={i} className="text-xs font-bold text-indigo-200/80 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                                    ✦ {rec}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]"></div>
         </div>
      </div>

      <PerformanceTrajectory scores={studentScores} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(AssessmentType).map(type => (
          <IndividualAssessmentChart key={type} scores={studentScores} type={type} />
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-black text-xl text-gray-900 tracking-tight">Academic Transcript</h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">SEM IV Records</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr>
                        <th className="px-10 py-5">Date</th>
                        <th className="px-10 py-5">Subject</th>
                        <th className="px-10 py-5">Assessment</th>
                        <th className="px-10 py-5">Credits</th>
                        <th className="px-10 py-5 text-right">Marks</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {sortedScores.map((s, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/20 transition-all group">
                            <td className="px-10 py-6 text-sm text-gray-400 font-medium">{s.date}</td>
                            <td className="px-10 py-6 text-sm font-black text-gray-900">
                                {s.subject}
                                <span className="block text-[10px] text-gray-400 font-bold">Code: {subjects.find(sub => sub.name === s.subject)?.code || 'N/A'}</span>
                            </td>
                            <td className="px-10 py-6">
                                <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-lg uppercase tracking-wider group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                    {s.type}
                                </span>
                            </td>
                            <td className="px-10 py-6 text-sm font-bold text-gray-500">{s.credits}C</td>
                            <td className="px-10 py-6 text-right">
                                <span className="text-lg font-black text-gray-900">{s.score}</span>
                                <span className="text-gray-300 font-bold ml-1">/ {s.maxScore}</span>
                            </td>
                        </tr>
                    ))}
                    {sortedScores.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-10 py-20 text-center">
                           <p className="text-gray-400 font-bold italic">Waiting for initial assessment sync...</p>
                        </td>
                      </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StudentDashboard);
