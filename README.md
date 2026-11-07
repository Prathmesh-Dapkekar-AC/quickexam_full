# QuickExam - Online Test & Automated Grading System

QuickExam is a secure, server-authoritative online examination platform built on the MERN stack.

## Key Features
- **Authoritative Clock**: Prevents client clock tampering by managing timers and immutable deadlines on the backend.
- **3 Flexible Grading Schemes**: Standard Negative Marking, Zero Penalty, and Per-Question Custom Weighting with a guaranteed score floor ($Score \ge 0$).
- **Anti-Cheat Integrity Telemetry**: Tracks fullscreen exits and tab switches via HTML5 Visibility API.
- **Auto-Submit Sweeper**: Background cron job sweeps orphaned/expired sessions.
- **Answer Key Security**: Strips `correctIndex` from student payloads via Mongoose projection.

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
# quickexam_full
