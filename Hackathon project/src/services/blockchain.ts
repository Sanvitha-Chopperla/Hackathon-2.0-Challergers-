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

export const issueCertificateOnChain = (cert: Certificate): string => {
    const hash = generateHash(cert);
    const chain = JSON.parse(localStorage.getItem('mockBlockchain') || '[]');

    // Save to "blockchain"
    chain.push({
        hash,
        timestamp: new Date().toISOString(),
        universityName: cert.universityName,
    });

    localStorage.setItem('mockBlockchain', JSON.stringify(chain));
    return hash;
};

export const verifyCertificate = (hash: string): boolean => {
    const chain = JSON.parse(localStorage.getItem('mockBlockchain') || '[]');
    return chain.some((block: any) => block.hash === hash);
};
