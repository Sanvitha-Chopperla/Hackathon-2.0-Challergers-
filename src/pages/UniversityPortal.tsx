import React, { useState } from 'react';
import { issueCertificateOnChain } from '../services/blockchain';
import type { Certificate } from '../services/blockchain';
import { GraduationCap, Upload, CheckCircle2, Copy } from 'lucide-react';

export default function UniversityPortal() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [formData, setFormData] = useState<Certificate>({
        studentId: '',
        studentName: '',
        degree: '',
        year: new Date().getFullYear().toString(),
        universityName: 'Global Tech University',
        issueDate: new Date().toISOString().split('T')[0],
    });

    const [issuedHash, setIssuedHash] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login authentication for prototype
        setIsAuthenticated(true);
    };

    const handleIssue = (e: React.FormEvent) => {
        e.preventDefault();
        const hash = issueCertificateOnChain(formData);
        setIssuedHash(hash);
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">University Admin Login</h2>
                    <p className="text-gray-500 text-sm mt-2">Access the secure certificate issuance portal.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution ID</label>
                        <input required type="text" placeholder="e.g., UNI-001" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
                        <input required type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white font-semibold py-2.5 rounded-lg hover:bg-purple-700 transition-colors mt-2">
                        Secure Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-purple-100 p-3 rounded-xl">
                    <GraduationCap className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Issue Certificate</h1>
                    <p className="text-gray-500">Generate a cryptographically secure credential on the ledger.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleIssue} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                            <input required type="text" value={formData.studentName} onChange={e => setFormData({ ...formData, studentName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Jane Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID (Immutable)</label>
                            <input required type="text" value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="STU-987654" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Degree / Certification</label>
                            <input required type="text" value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="B.S. Computer Science" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                            <input required type="number" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 flex justify-end">
                        <button type="submit" className="flex items-center space-x-2 bg-purple-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                            <Upload className="w-5 h-5" />
                            <span>Issue Secure Credential</span>
                        </button>
                    </div>
                </form>
            </div>

            {issuedHash && (
                <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-start space-x-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold text-green-900 mb-1">Certificate Issued Successfully</h3>
                            <p className="text-green-800 text-sm mb-4">
                                The academic credential has been permanently signed and secured on the decentralized ledger.
                                Share these credentials with the student.
                            </p>

                            <div className="bg-white p-4 rounded-xl border border-green-100 flex items-center justify-between">
                                <div className="overflow-hidden">
                                    <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Cryptographic Hash</p>
                                    <p className="text-sm font-mono text-gray-800 truncate select-all">{issuedHash}</p>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(issuedHash)}
                                    className="ml-4 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Copy Hash"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
