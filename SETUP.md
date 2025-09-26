# Quick Setup Guide - Digital Twin You

## Prerequisites
- Node.js 18+
- Python 3.8+
- Git

## Installation (5 minutes)

### 1. Clone & Navigate
```bash
git clone https://github.com/[username]/digital-twin-you.git
cd digital-twin-you
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on: http://localhost:5000

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

## Demo Usage

### Camera Simulator
1. Open http://localhost:3000
2. Navigate to "Camera" tab
3. Take photos with different settings
4. Watch AI confidence increase over time

### AI Learning Dashboard
1. Click "AI Dashboard" tab
2. View real-time learning visualization
3. See pattern strength evolution
4. Monitor behavioral clustering

### Samsung Ecosystem Demo
1. Click "Ecosystem" tab
2. See cross-device integration mockup
3. View Knox security simulation
4. Experience ecosystem lock-in concept

## Troubleshooting

### Backend Issues
- **Port 5000 busy**: Change port in `backend/app.py`
- **Module not found**: Run `pip install -r requirements.txt`

### Frontend Issues
- **Port 3000 busy**: React will suggest alternative port
- **Dependencies**: Delete `node_modules`, run `npm install`

### Database Issues
- **SQLite errors**: Delete `digital_twin.db`, restart backend

## Project Structure
```
digital-twin-you/
├── backend/           # Python Flask API
├── frontend/          # React camera simulator  
├── docs/             # Documentation
├── demo/             # Demo assets
└── archive/          # Unused files
```