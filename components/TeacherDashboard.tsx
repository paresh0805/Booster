
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AssessmentType, Student, ScoreEntry, Subject } from '../types';

interface TeacherDashboardProps {
  students: Student[];
  subjects: Subject[];
  onAddScores: (newScores: ScoreEntry[]) => void;
  onUpdateStudentName: (id: string, newName: string) => void;
  onUpdateStudentDiv: (id: string, newDiv: string) => void;
  onUpdateSubjectName: (id: string, newName: string) => void;
  onAddStudent: (newStudent: Student) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  students, 
  subjects,
  onAddScores, 
  onUpdateStudentName,
  onUpdateStudentDiv,
  onUpdateSubjectName,
  onAddStudent 
}) => {
  const [selectedClass, setSelectedClass] = useState('SE-AIML-A');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0].id);
  const [selectedType, setSelectedType] = useState(AssessmentType.IA1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [tempScores, setTempScores] = useState<Record<string, string>>({});
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingDivId, setEditingDivId] = useState<string | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  
  // Registration state
  const [isRegistering, setIsRegistering] = useState(false);
  const [newStudent, setNewStudent] = useState({ id: '', name: '', classId: 'SE-AIML-A' });

  // State for editable maximum marks
  const [editableMaxMarks, setEditableMaxMarks] = useState<number>(20);

  const filteredStudents = students.filter(s => s.classId === selectedClass);
  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Local state for subject name editing to prevent high-frequency global re-renders
  const [subjectEditValue, setSubjectEditValue] = useState(activeSubject.name);

  // Sync local edit state when active subject changes
  useEffect(() => {
    setSubjectEditValue(activeSubject.name);
  }, [activeSubject.id, activeSubject.name]);

  // Update default max marks when assessment type changes
  useEffect(() => {
    let defaultMax = 100;
    switch (selectedType) {
      case AssessmentType.IA1:
      case AssessmentType.IA2: defaultMax = 20; break;
      case AssessmentType.TW: defaultMax = 25; break;
      case AssessmentType.ESE: defaultMax = 80; break;
      case AssessmentType.ORAL_PRAC: defaultMax = 50; break;
    }
    setEditableMaxMarks(defaultMax);
  }, [selectedType]);

  const handleScoreChange = useCallback((studentId: string, value: string) => {
    const num = parseFloat(value);
    if (value === '' || (num >= 0 && num <= editableMaxMarks)) {
        setTempScores(prev => ({ ...prev, [studentId]: value }));
    }
  }, [editableMaxMarks]);

  const handleSubjectNameUpdate = () => {
    if (subjectEditValue.trim() !== "") {
      onUpdateSubjectName(activeSubject.id, subjectEditValue);
    }
    setEditingSubjectId(null);
  };

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.id || !newStudent.name) return;
    
    if (students.some(s => s.id === newStudent.id)) {
      alert("Roll Number already exists in database.");
      return;
    }

    onAddStudent({
      ...newStudent,
      major: 'AI & Machine Learning'
    });
    
    setNewStudent({ id: '', name: '', classId: selectedClass });
    setIsRegistering(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntries: ScoreEntry[] = filteredStudents
      .filter(s => tempScores[s.id])
      .map(s => ({
        studentId: s.id,
        subject: activeSubject.name,
        type: selectedType,
        score: parseFloat(tempScores[s.id]),
        maxScore: editableMaxMarks,
        date,
        credits: activeSubject.credits
      }));

    if (newEntries.length > 0) {
      onAddScores(newEntries);
      setTempScores({});
      alert(`Ledger Updated: ${newEntries.length} records committed.`);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <header>
          <div className="flex items-center gap-3 group">
            <h1 className="text-4xl font-black tracking-tight text-gray-900 underline decoration-indigo-600 decoration-4 italic">Faculty Terminal</h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-500 font-medium">Resource Management • </span>
            {editingSubjectId === activeSubject.id ? (
              <input 
                autoFocus
                className="bg-white border border-indigo-200 rounded px-2 py-0.5 outline-none ring-2 ring-indigo-500 font-bold text-gray-900 text-sm"
                value={subjectEditValue}
                onChange={(e) => setSubjectEditValue(e.target.value)}
                onBlur={handleSubjectNameUpdate}
                onKeyDown={(e) => e.key === 'Enter' && handleSubjectNameUpdate()}
              />
            ) : (
              <span 
                onClick={() => setEditingSubjectId(activeSubject.id)}
                className="text-gray-900 font-black cursor-pointer border-b border-dashed border-gray-300 hover:border-indigo-600 transition-colors"
              >
                {activeSubject.name}
              </span>
            )}
            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </div>
        </header>
        
        <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${isRegistering ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-gray-100 hover:border-indigo-600 shadow-sm'}`}
            >
              {isRegistering ? 'Close Form' : 'Register Candidate'}
            </button>
            <button
              onClick={() => {
                // export filtered students basic info
                const header = ['Roll,Name,Division'].join(',');
                const rows = filteredStudents.map(s => [s.id, `"${s.name.replace(/"/g,'""')}"`, s.classId].join(','));
                const csv = [header, ...rows].join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `students_${selectedClass}.csv`;
                document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
              }}
              className="px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-white text-indigo-600 border border-gray-100 hover:border-indigo-600 shadow-sm"
            >
              Export Students
            </button>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Ledger</p>
                  <p className="text-xl font-black text-gray-900">{filteredStudents.length} Students</p>
              </div>
          </div>
        </div>
      </div>

      {isRegistering && (
        <div className="bg-white p-10 rounded-[2.5rem] border border-indigo-100 shadow-xl shadow-indigo-100/20 animate-in fade-in slide-in-from-top-4">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black">+</div>
              <h3 className="font-black text-xl tracking-tight italic">Register New Candidate</h3>
           </div>
           <form onSubmit={handleRegisterStudent} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll Number</label>
                 <input 
                    required
                    placeholder="e.g. 22AI115"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    value={newStudent.id}
                    onChange={e => setNewStudent({...newStudent, id: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate Full Name</label>
                 <input 
                    required
                    placeholder="Enter Name"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    value={newStudent.name}
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Division</label>
                 <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-600 appearance-none transition-all cursor-pointer"
                    value={newStudent.classId}
                    onChange={e => setNewStudent({...newStudent, classId: e.target.value})}
                 >
                    <option value="SE-AIML-A">Division A</option>
                    <option value="SE-AIML-B">Division B</option>
                 </select>
              </div>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
              >
                Add Candidate
              </button>
           </form>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-10 bg-gray-900 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Target Division</label>
              <select 
                value={selectedClass} 
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full bg-gray-800 border-none rounded-2xl px-5 py-4 text-white font-bold ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="SE-AIML-A">SE-AIML Div A</option>
                <option value="SE-AIML-B">SE-AIML Div B</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Switch Subject</label>
              <select 
                value={selectedSubjectId} 
                onChange={e => setSelectedSubjectId(e.target.value)}
                className="w-full bg-gray-800 border-none rounded-2xl px-5 py-4 text-white font-bold ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {subjects.map(s => <option key={s.id} value={s.id}>{s.code}: {s.name}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Assessment Type</label>
              <select 
                value={selectedType} 
                onChange={e => setSelectedType(e.target.value as AssessmentType)}
                className="w-full bg-gray-800 border-none rounded-2xl px-5 py-4 text-white font-bold ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {Object.values(AssessmentType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Max Marks (Edit)</label>
              <input 
                type="number" 
                value={editableMaxMarks}
                onChange={e => setEditableMaxMarks(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-800 border-none rounded-2xl px-5 py-4 text-white font-bold ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Exam Date</label>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-gray-800 border-none rounded-2xl px-5 py-4 text-white font-bold ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="p-10">
          <div className="overflow-hidden border border-gray-100 rounded-3xl">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate Name (Edit)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">University Roll</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Div (Edit)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-48 text-right">Marks (Max {editableMaxMarks})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="group hover:bg-indigo-50/30 transition-all">
                    <td className="px-8 py-5 font-bold text-gray-900">
                      {editingNameId === student.id ? (
                        <input 
                          autoFocus
                          className="bg-white border border-indigo-200 rounded px-2 py-1 outline-none ring-2 ring-indigo-500 w-full"
                          value={student.name}
                          onChange={(e) => onUpdateStudentName(student.id, e.target.value)}
                          onBlur={() => setEditingNameId(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingNameId(null)}
                        />
                      ) : (
                        <span 
                          onClick={() => setEditingNameId(student.id)}
                          className="cursor-pointer border-b border-dashed border-gray-200 hover:border-indigo-600 transition-all"
                        >
                          {student.name}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-xs text-gray-400 font-mono">{student.id}</td>
                    <td className="px-8 py-5">
                      {editingDivId === student.id ? (
                        <select
                          autoFocus
                          className="bg-white border border-indigo-200 rounded px-2 py-1 outline-none ring-2 ring-indigo-500 font-bold text-xs"
                          value={student.classId}
                          onChange={(e) => onUpdateStudentDiv(student.id, e.target.value)}
                          onBlur={() => setEditingDivId(null)}
                        >
                          <option value="SE-AIML-A">Div A</option>
                          <option value="SE-AIML-B">Div B</option>
                        </select>
                      ) : (
                        <span 
                          onClick={() => setEditingDivId(student.id)}
                          className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded cursor-pointer hover:bg-indigo-100 transition-all"
                        >
                          {student.classId.split('-').pop()}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="inline-flex items-center gap-3">
                        <input 
                            type="number" 
                            min="0" 
                            max={editableMaxMarks}
                            placeholder="0"
                            value={tempScores[student.id] || ''}
                            onChange={e => handleScoreChange(student.id, e.target.value)}
                            className="w-24 text-right bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-indigo-600 font-black focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                        />
                        <span className="text-gray-300 font-black">/ {editableMaxMarks}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                       <p className="text-gray-400 font-bold italic">No candidates found in this division.</p>
                       <button 
                        onClick={() => setIsRegistering(true)}
                        className="mt-4 text-indigo-600 font-black text-xs uppercase tracking-widest underline decoration-2"
                       >
                        Register a student now
                       </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-400 max-w-xs font-medium italic">
              Update candidate names, divisions, or active subjects directly. Adjust parameters in the terminal header.
            </p>
            <button 
              type="submit"
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-12 rounded-2xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50"
              disabled={Object.keys(tempScores).length === 0}
            >
              <span className="uppercase tracking-[0.2em] text-xs">Sync Performance Ledger</span>
              <span className="bg-indigo-500/50 px-3 py-0.5 rounded-full text-[10px]">{Object.keys(tempScores).length}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default React.memo(TeacherDashboard);
