
import React, { useState } from 'react';
import { Role, Student, ScoreEntry, Subject, Faculty } from './types';
import { MOCK_STUDENTS, INITIAL_SCORES, SUBJECTS, MOCK_FACULTY } from './constants';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider, useToast } from './components/Toast';
import { saveToLocalStorage, getFromLocalStorage, storageKeys } from './utils/storage';

const AppContent: React.FC = () => {
  const { addToast } = useToast();
  const [role, setRole] = useState<Role | null>(() => getFromLocalStorage<Role>(storageKeys.USER_ROLE));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<Student | Faculty | null>(null);
  const [scores, setScores] = useState<ScoreEntry[]>(() => getFromLocalStorage(storageKeys.STUDENT_SCORES) || INITIAL_SCORES);
  const [students, setStudents] = useState<Student[]>(() => getFromLocalStorage(storageKeys.STUDENTS_DATA) || MOCK_STUDENTS);
  const [subjects, setSubjects] = useState<Subject[]>(() => getFromLocalStorage(storageKeys.SUBJECTS_DATA) || SUBJECTS);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !password.trim()) {
      addToast("Please fill in all fields", 'warning');
      return;
    }
    
    if (role === 'student') {
      const found = students.find(s => s.id.toLowerCase() === loginId.toLowerCase());
      if (found && password === found.id) {
        setCurrentUser(found);
        setIsLoggedIn(true);
        saveToLocalStorage(storageKeys.USER_ROLE, role);
        saveToLocalStorage(storageKeys.LAST_LOGIN, new Date().toISOString());
        addToast(`Welcome, ${found.name}!`, 'success');
      } else {
        addToast("Access Denied. Ensure correct Roll Number and Password.", 'error');
      }
    } else if (role === 'teacher') {
      const found = MOCK_FACULTY.find(f => f.id.toLowerCase() === loginId.toLowerCase());
      if (found && password === found.id) { // Mock: Password is same as Faculty ID
        setCurrentUser(found);
        setIsLoggedIn(true);
        saveToLocalStorage(storageKeys.USER_ROLE, role);
        saveToLocalStorage(storageKeys.LAST_LOGIN, new Date().toISOString());
        addToast(`Welcome, ${found.name}!`, 'success');
      } else {
        addToast("Faculty Authorization Failed.", 'error');
      }
    }
  };

  const simulateGoogleLogin = () => {
    if (role === 'student') {
      const demoStudent = students[0];
      setCurrentUser(demoStudent);
      setIsLoggedIn(true);
    } else {
      const demoFaculty = MOCK_FACULTY[0];
      setCurrentUser(demoFaculty);
      setIsLoggedIn(true);
    }
  };

  const addScores = (newEntries: ScoreEntry[]) => {
    const updated = [...scores, ...newEntries];
    setScores(updated);
    saveToLocalStorage(storageKeys.STUDENT_SCORES, updated);
  };

  const updateStudentName = (id: string, newName: string) => {
    const updated = students.map(s => s.id === id ? { ...s, name: newName } : s);
    setStudents(updated);
    saveToLocalStorage(storageKeys.STUDENTS_DATA, updated);
  };

  const updateStudentDiv = (id: string, newDiv: string) => {
    const updated = students.map(s => s.id === id ? { ...s, classId: newDiv } : s);
    setStudents(updated);
    saveToLocalStorage(storageKeys.STUDENTS_DATA, updated);
  };

  const updateSubjectName = (id: string, newName: string) => {
    const subjectToUpdate = subjects.find(s => s.id === id);
    if (!subjectToUpdate) return;
    const oldName = subjectToUpdate.name;
    const updated = subjects.map(s => s.id === id ? { ...s, name: newName } : s);
    setSubjects(updated);
    saveToLocalStorage(storageKeys.SUBJECTS_DATA, updated);
    const updatedScores = scores.map(score => score.subject === oldName ? { ...score, subject: newName } : score);
    setScores(updatedScores);
    saveToLocalStorage(storageKeys.STUDENT_SCORES, updatedScores);
  };

  const addStudent = (newStudent: Student) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    saveToLocalStorage(storageKeys.STUDENTS_DATA, updated);
  };

  const handleLogout = () => {
    setRole(null);
    setIsLoggedIn(false);
    setLoginId('');
    setPassword('');
    setCurrentUser(null);
    saveToLocalStorage(storageKeys.USER_ROLE, null);
    addToast("You have been logged out", 'info');
  };

  // Initial Role Selection
  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="w-full max-w-md space-y-8 text-center relative z-10 animate-fadeInUp">
          <div className="space-y-4">
            <div className="relative inline-flex mb-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-500 blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 text-white text-6xl shadow-2xl shadow-indigo-500/40 border border-white/20 transform hover:scale-110 transition-transform duration-500 ease-out italic font-black animate-bounce-slow">
                <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">B</span>
              </div>
            </div>
            <div>
              <h1 className="heading-1 text-gray-900 italic">Booster</h1>
              <p className="mt-2 text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">Academic Excellence Platform</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 pt-8">
            <button 
              onClick={() => setRole('teacher')}
              className="group bg-white border-2 border-gray-100 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10 p-8 rounded-2xl shadow-sm transition-all text-left transform hover:-translate-y-2 animate-slideInLeft"
              aria-label="Access Faculty Portal for batch entry and student management"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-xl tracking-tight">Faculty Portal</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">Manage grades & students</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all font-bold text-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transform" aria-hidden="true">
                  👨‍🏫
                </div>
              </div>
            </button>

            <button 
              onClick={() => setRole('student')}
              className="group bg-white border-2 border-gray-100 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10 p-8 rounded-2xl shadow-sm transition-all text-left transform hover:-translate-y-2 animate-slideInLeft"
              aria-label="Access Student Portal to view performance analytics and academic metrics"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-xl tracking-tight">Student Portal</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">View performance metrics</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all font-bold text-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transform" aria-hidden="true">
                  👨‍🎓
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Unified Login Barrier
  if (!isLoggedIn) {
    const isStudent = role === 'student';
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="w-full max-w-sm space-y-8 animate-fadeInUp relative z-10">
          <div className="text-center space-y-2">
             <button 
               onClick={() => setRole(null)} 
               className="mx-auto text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
             >
               ← Back to portal select
             </button>
             <h2 className="heading-2 text-gray-900 italic tracking-tight">{isStudent ? 'Student Portal' : 'Faculty Access'}</h2>
             <p className="body-small">{isStudent ? 'Sign in to view your performance analytics' : 'Secure terminal for grade management'}</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={simulateGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md py-3.5 px-6 rounded-xl shadow-sm transition-all transform active:scale-[0.98] group"
              aria-label="Sign in with institutional Google account"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-bold text-gray-700 text-sm">Sign in with Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t-2 border-gray-100"></span></div>
              <div className="relative flex justify-center text-xs font-black uppercase tracking-widest text-gray-400"><span className="bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">Or continue with credentials</span></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="loginId" className="text-xs font-black text-gray-600 uppercase tracking-widest">
                  {isStudent ? '📝 Roll Number' : '🆔 Employee ID'}
                </label>
                <input 
                  id="loginId"
                  autoFocus
                  type="text"
                  placeholder={isStudent ? "e.g. 22AI101" : "e.g. F001"}
                  className="w-full bg-white border-2 border-gray-200 hover:border-indigo-400 rounded-xl px-5 py-3.5 font-bold text-gray-900 focus:border-indigo-600 focus:shadow-lg focus:shadow-indigo-500/10 outline-none transition-all placeholder:text-gray-300"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                  aria-label={isStudent ? 'Student Roll Number' : 'Faculty Employee ID'}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-black text-gray-600 uppercase tracking-widest">🔐 Password</label>
                <input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white border-2 border-gray-200 hover:border-indigo-400 rounded-xl px-5 py-3.5 font-bold text-gray-900 focus:border-indigo-600 focus:shadow-lg focus:shadow-indigo-500/10 outline-none transition-all placeholder:text-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password or access key"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all transform active:scale-95 uppercase tracking-widest text-sm"
              >
                Sign In
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
            Demo ID: {isStudent ? '22AI101' : 'F001'} | Password: same as ID
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-500/30 italic transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              B
            </div>
            <span className="font-black text-xl tracking-tighter hidden sm:block italic group-hover:text-indigo-600 transition-colors">Booster</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Theme toggle removed */}
            {isLoggedIn && currentUser && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-black text-gray-400 uppercase leading-none">
                    {'major' in currentUser ? (currentUser as Student).id : (currentUser as Faculty).id}
                  </p>
                  <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/30">
                  {currentUser.name.charAt(0)}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button 
                onClick={() => { navigator.clipboard?.writeText(window.location.href); addToast('Share link copied', 'success'); }}
                className="text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                aria-label="Copy share link"
              >
                Share
              </button>
              <button 
                onClick={handleLogout}
                className="text-xs font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 transition-colors hover:bg-rose-50 px-4 py-2 rounded-lg"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {role === 'teacher' ? (
          <TeacherDashboard 
            students={students} 
            subjects={subjects}
            onAddScores={addScores} 
            onUpdateStudentName={updateStudentName}
            onUpdateStudentDiv={updateStudentDiv}
            onUpdateSubjectName={updateSubjectName}
            onAddStudent={addStudent}
          />
        ) : (
          currentUser && 'major' in currentUser && <StudentDashboard student={currentUser as Student} scores={scores} subjects={subjects} />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}
