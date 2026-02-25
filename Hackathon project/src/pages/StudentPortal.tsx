import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { UserCircle, ShieldAlert, CheckCircle2, QrCode } from 'lucide-react';
import { verifyCertificate, verifyCertificateByStudentId, getStudentHash } from '../services/blockchain';
import { authenticateUser, type User } from '../services/auth';

interface StudentPortalProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export default function StudentPortal({ currentUser, setCurrentUser }: StudentPortalProps) {
    const [credentials, setCredentials] = useState({ studentId: '', hash: '' });
    const [isVerified, setIsVerified] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        const { user: authenticatedUser, message, requiresVerification, sessionConflict } = authenticateUser(loginData.email, loginData.password);

        if (requiresVerification || sessionConflict) {
            setLoginError(message);
            return;
        }

        if (authenticatedUser && authenticatedUser.role === 'student') {
            setCurrentUser(authenticatedUser);
        } else {
            setLoginError(message);
        }
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        
        // First check if the student ID exists and has a certificate
        const existingHash = getStudentHash(credentials.studentId);
        
        if (existingHash) {
            // Student already has a certificate, verify the hash matches
            if (existingHash === credentials.hash) {
                setIsVerified(true);
            } else {
                alert("Error: The hash you entered does not match the certificate on file for this student ID. Please contact your university.");
            }
        } else {
            // No certificate found for this student ID
            alert("No certificate found for this student ID. Please contact your university to issue your certificate.");
        }
    };

    if (!currentUser) {
        return (
            <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>

                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Student Portal</h2>
                    <p className="text-gray-500 text-sm mt-2">Login to manage your verifiable credentials.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                        <input
                            required
                            type="email"
                            placeholder="student@university.edu"
                            value={loginData.email}
                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    {loginError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {loginError}
                        </div>
                    )}
                    <div className="pt-2">
                        <div className="flex items-center space-x-2 text-xs text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                            <ShieldAlert className="w-4 h-4 shrink-0" />
                            <span>Security monitoring is enabled. Suspicious login attempts will trigger email alerts.</span>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:ring-4 focus:ring-blue-500/20">
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                        <UserCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Digital Credentials</h1>
                        <p className="text-gray-500">Access and share your cryptographically secured certificates.</p>
                    </div>
                </div>
                <div className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200 shadow-sm flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Student Authenticated</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Enter Issued Credentials</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Enter the fixed credentials details provided by your university to access your verifiable QR code for employers.
                    </p>

                    <form onSubmit={handleVerify} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                            <input required type="text" value={credentials.studentId} onChange={e => setCredentials({ ...credentials, studentId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="STU-987654" />
                            {credentials.studentId && getStudentHash(credentials.studentId) && (
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                                    <p className="text-blue-800 font-medium mb-1">✓ Certificate Found!</p>
                                    <p className="text-blue-700 text-xs font-mono break-all">
                                        {getStudentHash(credentials.studentId)}
                                    </p>
                                    <p className="text-blue-600 text-xs mt-1">Copy this hash to the field below to verify your credentials.</p>
                                </div>
                            )}
                            {credentials.studentId && !getStudentHash(credentials.studentId) && (
                                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                                    <p className="text-yellow-800">No certificate found for this student ID yet. Contact your university to issue your certificate.</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cryptographic Hash (from University)</label>
                            <textarea required value={credentials.hash} onChange={e => setCredentials({ ...credentials, hash: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" rows={3} placeholder="Paste your 64-character SHA256 hash here..."></textarea>
                        </div>

                        <button type="submit" disabled={isVerified} className={`w-full font-semibold py-3 flex items-center justify-center space-x-2 rounded-lg transition-all ${isVerified ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`}>
                            {isVerified ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Submitted Successfully</span>
                                </>
                            ) : (
                                <span>Submit to Generate QR</span>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-white p-8 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
                    {!isVerified ? (
                        <div className="text-center opacity-40">
                            <QrCode className="w-32 h-32 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500 font-medium max-w-xs">Submit your valid credentials to dynamically generate your verification QR code.</p>
                        </div>
                    ) : (
                        <div className="text-center animate-in zoom-in duration-500 flex flex-col items-center">
                            <div className="bg-blue-50 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-full mb-6 border border-blue-100 inline-flex items-center space-x-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Ready to Share</span>
                            </div>

                            <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm mb-6 inline-block">
                                <QRCodeSVG
                                    value={JSON.stringify({ studentId: credentials.studentId, hash: credentials.hash })}
                                    size={240}
                                    level={"H"}
                                    includeMargin={true}
                                    className="rounded-xl"
                                />
                            </div>

                            <h4 className="font-bold text-gray-900 text-lg">Verification Pass</h4>
                            <p className="text-gray-500 text-sm max-w-xs mt-2">Display this QR code to prospective employers. They can scan it via the Employer Portal to instantly verify your degree.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
