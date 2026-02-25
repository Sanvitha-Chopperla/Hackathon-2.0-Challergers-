import SHA256 from 'crypto-js/sha256';

export interface Certificate {
    studentId: string;
    studentName: string;
    degree: string;
    year: string;
    universityName: string;
    issueDate: string;
}

export const generateHash = (data: any): string => {
    return SHA256(JSON.stringify(data)).toString();
};

export const getStudentHash = (studentId: string): string | null => {
    const chain = JSON.parse(localStorage.getItem('mockBlockchain') || '[]');
    const existingCert = chain.find((block: any) => block.studentId === studentId);
    return existingCert ? existingCert.hash : null;
};

export const issueCertificateOnChain = (cert: Certificate): { hash: string, isNew: boolean, message: string } => {
    const hash = generateHash(cert);
    const chain = JSON.parse(localStorage.getItem('mockBlockchain') || '[]');

    // Check if student ID already has a certificate
    const existingIndex = chain.findIndex((block: any) => block.studentId === cert.studentId);

    if (existingIndex !== -1) {
        // Replace existing certificate for this student
        const oldHash = chain[existingIndex].hash;
        chain[existingIndex] = {
            hash,
            studentId: cert.studentId,
            studentName: cert.studentName,
            degree: cert.degree,
            timestamp: new Date().toISOString(),
            universityName: cert.universityName,
            previousHash: oldHash,
        };
        localStorage.setItem('mockBlockchain', JSON.stringify(chain));
        return {
            hash,
            isNew: false,
            message: `Certificate updated for student ID ${cert.studentId}. Previous certificate replaced.`
        };
    } else {
        // Add new certificate
        chain.push({
            hash,
            studentId: cert.studentId,
            studentName: cert.studentName,
            degree: cert.degree,
            timestamp: new Date().toISOString(),
            universityName: cert.universityName,
        });
        localStorage.setItem('mockBlockchain', JSON.stringify(chain));
        return {
            hash,
            isNew: true,
            message: `Certificate issued for student ID ${cert.studentId}.`
        };
    }
};

export const verifyCertificate = (hash: string): boolean => {
    const chain = JSON.parse(localStorage.getItem('mockBlockchain') || '[]');
    return chain.some((block: any) => block.hash === hash);
};

export const verifyCertificateByStudentId = (studentId: string): { isValid: boolean, hash: string | null, cert: any | null } => {
    const chain = JSON.parse(localStorage.getItem('mockBlockchain') || '[]');
    const cert = chain.find((block: any) => block.studentId === studentId);
    return {
        isValid: !!cert,
        hash: cert ? cert.hash : null,
        cert: cert || null
    };
};
