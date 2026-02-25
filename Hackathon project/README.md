# 🎓 EduVerify - Secure Academic Credential Verification

**EduVerify** is a secure, blockchain-backed platform for instant verification of academic credentials. This hackathon project provides a decentralized solution to prevent credential fraud while protecting user privacy and enabling seamless verification for employers and educational institutions.

---

## 📋 Project Overview

EduVerify addresses the growing problem of academic credential fraud by implementing a **cryptographically secure verification system** with **advanced security features** to protect user accounts and prevent unauthorized access.

### 🎯 Problem Statement
- Academic credential fraud costs institutions and employers billions annually
- Verification processes are slow, expensive, and often inaccurate
- Traditional systems lack transparency and are vulnerable to forgery
- Account security is often overlooked in credential systems

### ✅ Solution
EduVerify provides:
- **Instant verification** via QR codes and cryptographic hashing
- **Fraud-proof credentials** stored on an immutable ledger
- **Advanced security** with device monitoring and session control
- **Multi-portal access** for students, employers, and universities

---

## ✨ Key Features

### 🔐 **Security Features**
- **Single Session Enforcement**: Only one login per account at any time
- **Device & IP Monitoring**: Detects logins from new devices/locations
- **Security Alerts**: Email notifications for suspicious login attempts
- **Failed Login Prevention**: Blocks unauthorized access attempts
- **Session Management**: Secure logout and session termination

### 📱 **Portal Features**

#### **Student Portal**
- Login with secure authentication
- Generate QR codes for credentials
- Share verifiable digital credentials
- Monitor verification attempts

#### **University Portal**
- Issue cryptographically secure certificates
- Generate immutable credential hashes
- Store certificates on the blockchain ledger
- Manage student credential issuance

#### **Employer Portal**
- Scan candidate QR codes
- Instantly verify academic credentials
- Cryptographic proof of authenticity
- Access verification history

### 🛡️ **Technical Security**
- Role-based access control (Student, Employer, University)
- Cryptographic hashing (SHA-256)
- Mock blockchain ledger for credential storage
- Session tracking and conflict detection
- Login attempt logging

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v16 or higher)
- npm (v8 or higher)

### **Installation**

1. **Navigate to project directory:**
   ```bash
   cd "Hackathon project"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

### **Access the Application**
- Open your browser and navigate to the URL shown in terminal (typically `http://localhost:5180/`)
- The application will automatically reload on code changes.**only one login at a time and try to open new tab we get already login in .please logout from devices first**

---

## 👥 Test Accounts

Use these credentials to test the different portals:

| Role | Email | Password |
|------|-------|----------|
| **Student** | `student@university.edu` | `password123` |
| **Employer** | `hr@company.com` | `password123` |
| **University** | `admin@university.edu` | `password123` |

---

## 🧪 Testing Security Features

### **Test Single Session Enforcement**
1. Login with `student@university.edu` in one browser window
2. Try logging in with the same credentials in another window
3. See the security alert: *"Account already logged in from another location"*

### **Test Failed Login Alert**
1. Try logging in with correct email but wrong password
2. Receive security notification: *"Failed login attempt detected"*

### **Test Successful Login Notification**
1. Login with correct credentials
2. Account owner receives notification about the new login

---

## 📦 Project Structure

```
src/
├── App.tsx                 # Main app component with routing
├── pages/
│   ├── StudentPortal.tsx   # Student credential management
│   ├── UniversityPortal.tsx # Certificate issuance
│   └── EmployerPortal.tsx  # Credential verification
├── services/
│   ├── auth.ts             # Authentication & session management
│   └── blockchain.ts       # Certificate verification & hashing
├── App.css                 # Global styles
└── main.tsx               # App entry point
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **QR Codes**: qrcode.react
- **Routing**: React Router DOM v7
- **Cryptography**: crypto-js (SHA-256)
- **Scanner**: react-qr-scanner

---

## 📝 Features Breakdown

### **Authentication System**
- Email and password-based login
- Role-based access control
- Failed attempt detection
- Session conflict resolution

### **Credential Verification**
- SHA-256 cryptographic hashing
- QR code generation and scanning
- Immutable blockchain ledger storage
- Instant verification results

### **User Experience**
- Clean, modern UI with Tailwind CSS
- Responsive design for all devices
- Real-time feedback and notifications
- Intuitive portal navigation

---

## 🔒 Security Architecture

### **Login Security**
1. Username/password validation
2. Check for existing active sessions
3. Detect suspicious login patterns
4. Send security alerts for abnormal activity
5. Block concurrent logins

### **Credential Security**
1. Hash credentials using SHA-256
2. Store hashes on immutable ledger
3. Verify through QR code scanning
4. Provide cryptographic proof of authenticity

---

## 📞 Support

For issues or questions:
1. Check the browser console (F12) for error details
2. Verify you're using correct test credentials
3. Ensure all dependencies are installed (`npm install`)
4. Clear browser cache and reload if experiencing issues

---

## 📄 License

This project is built for hackathon purposes.

---

**Ready to test?** Open http://localhost:5180/ and start verifying credentials securely! 🚀

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
