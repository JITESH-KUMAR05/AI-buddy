# 🤖 AI Buddy - Your Inte## ✨ Features

- 🔐 **User Authentication** - Secure login/signup with JWT tokens
- 🎁 **Free Tier** - 5 free AI prompts per user account
- 👑 **Super User Access** - Unlimited prompts for teamaibuddy@gmail.com
- 🗣️ **Voice Recognition** - Speak your questions naturally
- 🔊 **Text-to-Speech** - Listen to AI responses
- 📄 **PDF Upload & Processing** - Extract text from PDF documents (up to 5MB)
- 📊 **Document Analysis** - AI-powered detailed analysis and insights from uploaded documents
- 💬 **Intelligent Chat** - Powered by GitHub Models API with enhanced document context
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🌐 **Production Ready** - Deployed on modern cloud platformstudy Companion

> **Born from Innovation**: Created during the Microsoft AI Innovators Hub Workshop - a journey from learning to building! 🚀

## 🌐 Live Demo

🎉 **Live Application**: [https://ai-buddy-jk.vercel.app/](https://ai-buddy-jk.vercel.app/)  
🖥️ **Backend API**: [https://ai-buddy-2idr.onrender.com](https://ai-buddy-2idr.onrender.com) Buddy - Your Intelligent Study Companion

> **Born from Innovation**: Created during the Microsoft AI Innovators Hub Workshop - a journey from learning to building! 🚀

---

## �🌟 Project Origin

This project was born from an incredible experience at the **Microsoft AI Innovators Hub Workshop**! Out of 1500+ applicants, I was fortunate to be among the selected 150 for this invite-only AI workshop powered by **Microsoft & Rinav Tech**, with support from **Global AI Hyderabad & Global AI Puducherry**.

### 🙏 Special Thanks To

- **[Venkat Sir]** - Frontend guidance and incredible energy throughout the workshop
- **[Aditya Saladi]** - Backend architecture and implementation
- **Microsoft AI Innovators Hub** - For this amazing platform and celebrating their 1-year anniversary!

The original workshop project was beautifully architected by the mentors, and I've taken the liberty to enhance and modify it further with additional features and deployment optimizations.

## ✨ Features

- 🗣️ **Voice Recognition** - Speak your questions naturally
- 🔊 **Text-to-Speech** - Listen to AI responses
- 📄 **Document Upload & Processing** - Support for PDF and text files (up to 5MB)
- 📊 **Document Analysis** - AI-powered detailed analysis and insights from uploaded documents
- 💬 **Intelligent Chat** - Powered by GitHub Models API with enhanced document context
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🌐 **Production Ready** - Deployed on Render with auto-scaling

## 🚀 Planned Enhancements

Building upon the workshop foundation, I'm working on:
- 📚 Enhanced document reading capabilities
- 🔍 Smart document search and indexing
- 💾 Chat history persistence
- 🎨 Modern UI/UX improvements
- 🔧 Advanced AI model integration

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **PDF.js** - Client-side PDF processing
- **Web APIs** - Speech Recognition & Synthesis

### Backend
- **Python 3.11** - Core backend language
- **Flask** - Lightweight web framework
- **SQLite** - User authentication and usage tracking
- **JWT** - Secure token-based authentication
- **GitHub Models API** - AI language model integration
- **Gunicorn** - Production WSGI server
- **Render** - Cloud deployment platform

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **npm** or **yarn**
- **GitHub Personal Access Token** (for AI functionality)

## 🚀 Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/JITESH-KUMAR05/AI-buddy.git
cd AI-buddy
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env
# Add your OpenAI API key to .env file
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env
# Configure API base URL in .env file
```

### 4. Environment Configuration

#### Backend (.env)
```bash
GITHUB_TOKEN=your_github_personal_access_token_here
SMTP_SENDER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
JWT_SECRET_KEY=your-very-secure-secret-key-here
```

#### Frontend (.env)
```bash
# For local development
VITE_API_BASE_URL=http://localhost:5000

# For production
VITE_API_BASE_URL=https://ai-buddy-2idr.onrender.com
```

## 🎯 Running the Application

### Development Mode

1. **Start Backend Server**
```bash
cd backend
python app.py
# Server runs on http://localhost:5000
```

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

### Production Build

```bash
cd frontend
npm run build
# Creates optimized build in dist/ folder
```

## 🌐 Deployment

### Backend (Render) ✅ **DEPLOYED**
**Live API**: [https://ai-buddy-2idr.onrender.com](https://ai-buddy-2idr.onrender.com)

1. **Create a new Web Service on [Render](https://render.com)**
2. **Connect your GitHub repository**
3. **Configure settings**:
   - **Root Directory**: `backend`
   - **Build Command**: (leave blank)
   - **Start Command**: `gunicorn app:app`
4. **Set Environment Variables**:
   ```bash
   GITHUB_TOKEN=your_github_token_here
   SMTP_SENDER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```
5. **Deploy!**

### Frontend (Vercel) ✅ **DEPLOYED**
**Live Application**: [https://ai-buddy-jk.vercel.app/](https://ai-buddy-jk.vercel.app/)

1. Build the project: `npm run build`
2. Deploy to Vercel or your preferred platform
3. Set environment variables:
   - `VITE_API_BASE_URL=https://ai-buddy-2idr.onrender.com`

## 📁 Project Structure

```
ai-buddy/
├── backend/
│   ├── app.py               # Backend API server (Flask app)
│   ├── Procfile             # Render deployment configuration
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Backend environment variables
│   └── .gitignore          # Backend git ignore rules
├── frontend/
│   ├── src/
│   │   ├── combonents/
│   │   │   └── ChatBot.jsx # Main chat component
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Frontend dependencies
│   ├── .env                # Frontend environment variables
│   └── vite.config.js      # Vite configuration
└── README.md               # This file
```

## 🔧 Key Features Implementation

### User Authentication & Usage Management
- **JWT-based Authentication**: Secure token-based login system
- **Free Tier**: Each user gets 5 free AI prompts
- **Usage Tracking**: Real-time monitoring of prompt usage
- **Super User Access**: teamaibuddy@gmail.com has unlimited access (password: teamaibuddy)
- **Secure Registration**: Password hashing with SHA-256
- **Persistent Sessions**: Users stay logged in across browser sessions
- **Database**: SQLite for user management and usage tracking

### Enhanced Document Processing
- **File Format Support**: PDF and text files (.pdf, .txt)
- **File Size Limit**: 5MB maximum for optimal performance
- **Robust PDF Processing**: CDN-based PDF.js with enhanced error handling
- **Text Extraction**: Advanced text extraction with page-by-page processing
- **Document Analysis**: AI provides detailed insights based on document content
- **Smart Prompting**: Automatically generates contextual prompts for uploaded documents
- **Error Recovery**: Graceful handling of corrupted or image-based PDFs
- **Visual Feedback**: Loading states and success/error notifications

### Voice Features
- Browser-native Speech Recognition API
- Text-to-Speech for AI responses
- Cross-browser compatibility

### AI Integration
- **GitHub Models API** integration for intelligent responses
- **Enhanced Context Processing**: Combines user queries with document content
- **Detailed Analysis**: Increased token limits for comprehensive document analysis
- **Usage Limitations**: Prompt counting and limits enforcement
- Custom prompt handling and response processing
- Error handling and fallbacks
- Environment-based configuration

## 🤝 Contributing

This project started as a learning experience and continues to evolve! Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🎉 Acknowledgments

- **Microsoft AI Innovators Hub** for the incredible workshop experience
- **Global AI Hyderabad & Global AI Puducherry** for community support
- **Rinav Tech** for technical partnership
- All the amazing developers and mentors who made this journey possible

---

> **"From Workshop to Production"** - This project represents the beautiful journey from learning in a workshop to building and deploying a real-world application. The foundation was laid by incredible mentors, and the journey continues with community-driven enhancements!

**Built with ❤️ during Microsoft AI Innovators Hub Workshop and enhanced with passion for AI innovation**