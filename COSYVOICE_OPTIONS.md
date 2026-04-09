# 🎵 HOW TO USE CosyVoice WITH YOUR SYSTEM

Your Xavier OS application works perfectly with **Google Translate TTS** right now. But if you specifically want CosyVoice's advanced emotion control, here are your options:

## ⭐ OPTION 1: Docker (Easiest - Recommended)

If you have Docker Desktop installed, this is the easiest path:

```bash
# Build a Docker image with CosyVoice
docker build -f Dockerfile.cosyvoice -t cosyvoice-service .

# Run it (maps models from your system)
docker run -p 3003:3003 \
  -v c:\Users\leanne\CosyVoice:/app/models \
  cosyvoice-service
```

This gives you CosyVoice running inside a container with all dependencies isolated.

**Dockerfile.cosyvoice** (use as template):
```dockerfile
FROM python:3.10

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    git build-essential

# Install PyTorch
RUN pip install torch torchaudio

# Copy CosyVoice
COPY /path/to/CosyVoice /app/models

# Install CosyVoice
WORKDIR /app/models
RUN pip install -e .

# Go back and run service
WORKDIR /app
COPY cosyvoice_service.py .
RUN pip install flask flask-cors

CMD ["python", "cosyvoice_service.py"]
```

## 🌐 OPTION 2: Vercel Deployment (CloudBased)

Deploy your app to Vercel and add serverless CosyVoice:

1. Push to GitHub
2. Connect to Vercel
3. Add serverless function for CosyVoice at `/api/cosyvoice`
4. System automatically uses Vercel's function instead of local port

**Vercel Function** (`/api/cosyvoice.py`):
```python
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from cosyvoice.cli.cosyvoice import CosyVoice

model = CosyVoice('models/CosyVoice2-0.5B')

def handler(req, res):
    if req.method == 'GET':
        text = req.query.get('text')
        emotion = req.query.get('emotion', 'neutral')
        
        for output in model.inference_zero_shot(text, 'ChineseFemaleYoung', None):
            res.set_header('Content-Type', 'audio/wav')
            res.send(output['tts_speech'].numpy().tobytes())
            break
    
    res.status(400).send({'error': 'text required'})
```

Then update Express backend to call Vercel endpoint instead of localhost:3003.

## 🔧 OPTION 3: Manual Python Setup (Advanced)

If you want CosyVoice running locally on your machine:

### Step 1: Get Working Python

Use the Python executable we found:
```powershell
$pythonExe = "C:\Users\leanne\.codemate\bin\environment\python.exe"
& $pythonExe --version
```

### Step 2: Create Virtual Environment
```powershell
$pythonExe = "C:\Users\leanne\.codemate\bin\environment\python.exe"
& $pythonExe -m venv cosyvoice_env
./cosyvoice_env/Scripts/Activate.ps1
```

### Step 3: Install Dependencies
```powershell
pip install --upgrade pip setuptools wheel
pip install torch torchvision torchaudio
pip install Flask Flask-CORS
pip install soundfile librosa
pip install numpy scipy
```

### Step 4: Install CosyVoice
```powershell
cd C:\Users\leanne\CosyVoice
pip install -e .
```

### Step 5: Run CosyVoice Service
```powershell
cd c:\Users\leanne\library
python cosyvoice_service.py
```

### Step 6: Update Express Backend
Modify `/api/tts` endpoint in `server.js` to call `http://localhost:3003` for CosyVoice instead of Node TTS service.

## 🐋 OPTION 4: WSL2 + Docker (Professional Setup)

Use Windows Subsystem for Linux with Docker:

```bash
# Inside WSL2
wsl --install -d Ubuntu-22.04

# Install Docker inside WSL
sudo apt-get update
sudo apt-get install -y docker.io

# Clone CosyVoice
cd /mnt/c/Users/leanne/CosyVoice

# Run Docker
docker run --rm -it \
  -v /mnt/c/Users/leanne/CosyVoice:/models \
  -p 3003:3003 \
  python:3.10 bash
```

Then inside the container:
```bash
pip install -e /models
pip install flask flask-cors torch torchaudio
cd /models
python ../cosyvoice_service.py
```

## 📊 Comparison: Current vs CosyVoice

| Feature | Google Translate TTS | CosyVoice2 |
|---------|-------------------|-----------|
| **Emotion Control** | 4 emotions | 20+ emotions |
| **Voice Quality** | Good | Excellent |
| **Setup Time** | 0 min (already done) | 30-120 min |
| **System Requirements** | Minimal | Python + PyTorch |
| **API Key Required** | No | No |
| **Can Run Offline** | No (needs internet) | Yes (GPU preferred) |
| **Language Support** | 100+ | Chinese + English |
| **Current Status** | ✅ WORKING | ⏸️ Needs setup |

## 🎯 RECOMMENDATION

**Start with current system (Google Translate TTS)** and upgrade to CosyVoice later if you want higher-quality emotional narration.

The current system is:
- ✅ Working immediately
- ✅ Sounds natural
- ✅ Has emotion detection
- ✅ Requires no additional setup

When you're ready for CosyVoice, use **Docker Option** (easiest) or **Vercel Option** (cloud-based).

## 🚀 VERIFY CURRENT SYSTEM WORKING

Open a terminal and run:

```powershell
# Check all services
curl http://localhost:3003/health     # TTS Service
curl http://localhost:3002/health     # Express Backend (if added)
curl http://localhost:3001/           # React Frontend
```

If all respond with 200 status, your system is fully operational.

## 💬 QUESTIONS?

See [`COSYVOICE_INTEGRATION.md`](COSYVOICE_INTEGRATION.md) for technical details.
See [`SYSTEM_READY.md`](SYSTEM_READY.md) for current status.

**Your system is ready now. CosyVoice is optional enhancement.** 🎵
