import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ShieldCheck, GraduationCap, Building2, UserCircle, LogOut } from 'lucide-react';
import StudentPortal from './pages/StudentPortal';
import UniversityPortal from './pages/UniversityPortal';
import EmployerPortal from './pages/EmployerPortal';
import { terminateSession, type User } from './services/auth';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="bg-blue-100 p-4 rounded-full mb-6 relative">
        <ShieldCheck className="w-16 h-16 text-blue-600" />
        <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
        Secure Academic <span className="text-blue-600">Credential Verification</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
        Instant, fraud-proof validation of academic credentials powered by decentralized tech.
        Select your portal to continue.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <Link to="/student" className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="bg-blue-50 p-4 rounded-2xl mb-4 group-hover:bg-blue-100 transition-colors">
            <UserCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Portal</h2>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">Access credentials, generate QR codes, and monitor verification attempts.</p>
        </Link>

        <Link to="/university" className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="bg-purple-50 p-4 rounded-2xl mb-4 group-hover:bg-purple-100 transition-colors">
            <GraduationCap className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">University Portal</h2>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">Issue verifiable digital certificates directly to the secure ledger.</p>
        </Link>

        <Link to="/employer" className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="bg-teal-50 p-4 rounded-2xl mb-4 group-hover:bg-teal-100 transition-colors">
            <Building2 className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Employer Portal</h2>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">Scan and instantly verify candidate credentials with cryptographic proof.</p>
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogout = () => {
    if (currentUser) {
      terminateSession(currentUser.email);
    }
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <ShieldCheck className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="font-extrabold text-xl tracking-tight text-gray-900">EduVerify</span>
            </Link>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-1">
                <Link to="/student" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-all">Student</Link>
                <Link to="/university" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition-all">University</Link>
                <Link to="/employer" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-teal-700 hover:bg-teal-50 transition-all">Employer</Link>
              </nav>
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative">
          {/* Subtle background decorative blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/student" element={<StudentPortal currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
            <Route path="/university" element={<UniversityPortal currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
            <Route path="/employer" element={<EmployerPortal currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-sm text-gray-500">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-gray-700">EduVerify</span>
            </div>
            <p>&copy; {new Date().getFullYear()} EduVerify Platform. Built for the Hackathon.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
