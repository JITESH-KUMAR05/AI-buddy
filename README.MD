# 🤖 AI Buddy - Your Intelligent Study Companion

> **Born from Innovation**: Created during the Microsoft AI Innovators Hub Workshop - a journey from learning to building! 🚀

## 🌟 Project Origin

This project was born from an incredible experience at the **Microsoft AI Innovators Hub Workshop**! Out of 1500+ applicants, I was fortunate to be among the selected 150 for this invite-only AI workshop powered by **Microsoft & Rinav Tech**, with support from **Global AI Hyderabad & Global AI Puducherry**.

### 🙏 Special Thanks To

- **[Venkat Sir]** - Frontend guidance and incredible energy throughout the workshop
- **[Aditya Saladi]** - Backend architecture and implementation
- **Microsoft AI Innovators Hub** - For this amazing platform and celebrating their 1-year anniversary!

The original workshop project was beautifully architected by the mentors, and I've taken the liberty to enhance and modify it further with additional features and deployment optimizations.

## ✨ Features

- 🗣️ **Voice Recognition** - Speak your questions naturally
- 🔊 **Text-to-Speech** - Listen to AI responses
<!-- - 📄 **PDF Upload & Processing** - Extract text from PDF documents -->
- 💬 **Intelligent Chat** - Powered by advanced AI models
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🌐 **Easy Deployment** - Ready for Netlify, Vercel, and more

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
- **Python** - Core backend language
- **Flask** - API framework
- **OpenAI GPT** - AI language model
- **Environment Variables** - Secure configuration

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **OpenAI API Key** (for AI functionality)

## 🚀 Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-buddy.git
cd ai-buddy
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
OPENAI_API_KEY=your_openai_api_key_here
SMTP_SENDER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

#### Frontend (.env)
```bash
# For local development
VITE_API_BASE_URL=http://localhost:5000

# For production
# VITE_API_BASE_URL=https://your-backend-url.com
```

## 🎯 Running the Application

### Development Mode

1. **Start Backend Server**
```bash
cd backend
python main.py
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

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform:
   - `VITE_API_BASE_URL=https://your-backend-url.com`

### Backend (Heroku/Railway/Render)
1. Deploy using your preferred platform
2. Set environment variables:
   - `OPENAI_API_KEY`
   - `SMTP_SENDER`
   - `SMTP_PASSWORD`

## 📁 Project Structure

```
ai-buddy/
├── backend/
│   ├── main.py              # Backend API server
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Backend environment variables
│   └── .gitignore          # Backend git ignore rules
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatBot.jsx # Main chat component
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Frontend dependencies
│   ├── .env                # Frontend environment variables
│   └── vite.config.js      # Vite configuration
└── README.md               # This file
```

## 🔧 Key Features Implementation

### PDF Processing
- Uses PDF.js for client-side PDF text extraction
- Supports drag-and-drop file upload
- Automatically populates chat with extracted text

### Voice Features
- Browser-native Speech Recognition API
- Text-to-Speech for AI responses
- Cross-browser compatibility

### AI Integration
- OpenAI GPT integration for intelligent responses
- Streaming responses for better UX
- Error handling and fallbacks

## 🤝 Contributing

This project started as a learning experience and continues to evolve! Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Acknowledgments

- **Microsoft AI Innovators Hub** for the incredible workshop experience
- **Global AI Hyderabad & Global AI Puducherry** for community support
- **Rinav Tech** for technical partnership
- All the amazing developers and mentors who made this journey possible

---

> **"From Workshop to Production"** - This project represents the beautiful journey from learning in a workshop to building and deploying a real-world application. The foundation was laid by incredible mentors, and the journey continues with community-driven enhancements!

**Built with ❤️ during Microsoft AI Innovators Hub Workshop and enhanced with passion for AI innovation**