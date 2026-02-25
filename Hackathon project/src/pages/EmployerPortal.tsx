import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Building2, QrCode, ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { verifyCertificate } from '../services/blockchain';
import { authenticateUser, type User } from '../services/auth';

interface EmployerPortalProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export default function EmployerPortal({ currentUser, setCurrentUser }: EmployerPortalProps) {
    const [scanResult, setScanResult] = useState<{ isValid: boolean, data?: any } | null>(null);
    const [isScanning, setIsScanning] = useState(false);
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

        if (authenticatedUser && authenticatedUser.role === 'employer') {
            setCurrentUser(authenticatedUser);
        } else {
            setLoginError(message);
        }
    };

    if (!currentUser) {
        return (
            <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Employer Access</h2>
                    <p className="text-gray-500 text-sm mt-2">Login with your corporate account to verify candidate credentials.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
                        <input
                            required
                            type="email"
                            placeholder="hr@company.com"
                            value={loginData.email}
                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                        />
                    </div>
                    {loginError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {loginError}
                        </div>
                    )}
                    <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-2.5 rounded-lg hover:bg-teal-700 transition-colors mt-2">
                        Sign In to Verify
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <div className="bg-teal-100 p-3 rounded-xl">
                        <Building2 className="w-8 h-8 text-teal-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Candidate Verifier</h1>
                        <p className="text-gray-500">Scan QR codes provided by candidates to instantly cryptographically verify their academic records.</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setCurrentUser(null);
                        setScanResult(null);
                        setIsScanning(false);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                    Logout
                </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
                {!isScanning && !scanResult && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="bg-teal-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                            <QrCode className="w-12 h-12 text-teal-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Scan</h3>
                        <p className="text-gray-500 max-w-sm mb-8">
                            Ask the candidate to present their verified QR code from the Student Portal.
                        </p>
                        <button
                            onClick={() => setIsScanning(true)}
                            className="bg-teal-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-teal-700 transition-colors shadow-sm flex items-center space-x-2"
                        >
                            <QrCode className="w-5 h-5" />
                            <span>Initiate Scanner</span>
                        </button>
                    </div>
                )}

                {isScanning && (
                    <div className="flex flex-col items-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Scanning...</h3>
                        <div className="w-full max-w-md bg-black rounded-2xl overflow-hidden aspect-square border-4 border-teal-100 relative shadow-inner">
                            <Scanner
                                onScan={(result) => handleScan(result)}
                                onError={(error) => console.log(error)}
                                components={{
                                    onOff: true,
                                    torch: true,
                                    zoom: true,
                                    finder: false,
                                }}
                            />
                            {/* Target overlay */}
                            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
                                <div className="w-full h-full border-2 border-teal-500"></div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsScanning(false)}
                            className="mt-6 text-gray-500 font-medium hover:text-gray-700"
                        >
                            Cancel Scan
                        </button>
                    </div>
                )}

                {scanResult && (
                    <div className={`p-8 rounded-2xl flex-1 flex flex-col items-center text-center animate-in zoom-in duration-300 ${scanResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        {scanResult.isValid ? (
                            <>
                                <ShieldCheck className="w-20 h-20 text-green-600 mb-4" />
                                <h2 className="text-3xl font-extrabold text-green-900 mb-2">CERTIFICATES ARE VALID</h2>
                                <div className="bg-white p-4 rounded-xl border border-green-100 mt-4 w-full text-left">
                                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">Verified Data Payload</p>
                                    <p className="mb-1"><span className="text-gray-500">Student ID:</span> <span className="font-bold text-gray-900">{scanResult.data?.studentId}</span></p>
                                    <p className="mb-0 overflow-hidden"><span className="text-gray-500">Ledger Hash:</span><br /><span className="font-mono text-xs text-green-700 break-all">{scanResult.data?.hash}</span></p>
                                </div>
                                <p className="text-green-800 text-sm mt-6 font-medium bg-green-200/50 px-4 py-2 rounded-lg">
                                    This candidate's academic record exists on the secure ledger and has not been altered.
                                </p>
                            </>
                        ) : (
                            <>
                                <ShieldAlert className="w-20 h-20 text-red-600 mb-4" />
                                <h2 className="text-3xl font-extrabold text-red-900 mb-2">CERTIFICATES ARE TAMPERED/FAKE</h2>
                                <p className="text-red-800 mt-2 font-medium bg-red-200/50 px-4 py-2 rounded-lg max-w-sm">
                                    WARNING: This credential could not be found on the cryptographic ledger. This indicates potential fraud or manipulation.
                                </p>
                            </>
                        )}

                        <button
                            onClick={() => setScanResult(null)}
                            className={`mt-10 font-bold py-2.5 px-8 rounded-full shadow-sm transition-colors ${scanResult.isValid ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                        >
                            Scan Another Code
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
