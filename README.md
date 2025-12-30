# 🚀 CodeZen - AI-Powered Documentation Generator

<p align="center">
  <strong>Intelligent Documentation Agent that Evolves with Every Line of Code</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI"/>
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**CodeZen** is an AI-powered documentation generation platform that automatically analyzes GitHub repositories, provides intelligent code suggestions, and generates comprehensive technical documentation. It leverages Google's Gemini AI and Microsoft's AutoGen framework to create a sophisticated multi-agent system capable of understanding, analyzing, and documenting codebases.

---

## ✨ Features

### 🔍 Repository Analysis
- Fetch and analyze any public GitHub repository
- Recursive file traversal supporting multiple programming languages
- Intelligent code parsing for Python, JavaScript, TypeScript, and more

### 🧠 AI-Powered Analysis
- Code quality analysis and issue detection
- Refactoring suggestions with detailed explanations
- Accept/Reject workflow for code improvements
- Interactive suggestion management

### 📄 Documentation Generation
- Automated Technical Design Document (TDD) generation
- Per-file documentation with purpose, functions, and dependencies
- Project-level documentation with architecture overview

### 📦 Multi-Format Export
- **PDF** - Professional formatted documents with WeasyPrint
- **DOCX** - Styled Word documents with custom formatting
- **Markdown** - Clean markdown files for GitHub/GitLab
- **HTML** - Web-ready documentation pages
- **TXT** - Plain text exports

### 🔐 GitHub Integration
- OAuth authentication for secure repository access
- Commit changes directly to repositories (with user approval)
- Token-based authentication for private repositories

---

## 🏗️ Architecture


<img width="1908" height="743" alt="codezen" src="https://github.com/user-attachments/assets/6638cc73-20f0-4146-b31d-fb4b5f062098" />


---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance async web framework |
| **Google Gemini** | AI model for code analysis & documentation |
| **AutoGen** | Multi-agent orchestration framework |
| **WeasyPrint** | PDF generation with HTML/CSS styling |
| **python-docx** | Microsoft Word document generation |
| **ReportLab** | PDF canvas-based generation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | Modern UI framework |
| **Vite** | Fast build tool and dev server |
| **TailwindCSS** | Utility-first CSS framework |
| **Axios** | HTTP client for API calls |
| **React-Markdown** | Markdown rendering |
| **Lucide React** | Icon library |

---

## 📋 Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))
- **GitHub OAuth App** (for repository access) - [Create OAuth App](https://github.com/settings/developers)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YeshwanthMotivity/Codezen-V1.git
cd Codezen-V1
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Google Gemini API Key (Required)
GOOGLE_API_KEY=your_gemini_api_key_here

# GitHub OAuth (Optional - for authenticated access)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

> ⚠️ **Important**: Never commit your `.env` file to version control. It contains sensitive credentials.

---

## 🎮 Usage

### Start the Backend Server

```bash
cd backend
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Using CodeZen

1. **Enter Repository URL**: Paste any public GitHub repository URL
2. **Run Analysis**: Click "Run Agent" to fetch and analyze the repository
3. **Review Suggestions**: Accept or reject AI-generated code improvement suggestions
4. **Apply Changes**: Apply accepted suggestions (can optionally commit to repo)
5. **Generate Documentation**: Generate comprehensive project documentation
6. **Export**: Download documentation in your preferred format (PDF, DOCX, MD, etc.)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/login/github` | Initiate GitHub OAuth login |
| `GET` | `/oauth/callback` | GitHub OAuth callback handler |
| `POST` | `/run-analysis` | Analyze a GitHub repository |
| `POST` | `/apply-changes` | Apply accepted suggestions and generate docs |
| `POST` | `/generate-docs` | Generate documentation for a repository |
| `POST` | `/export-docs` | Export documentation in specified format |

---

## 📁 Project Structure

```
Codezen-V1/
├── backend/
│   ├── main.py                    # FastAPI application entry point
│   ├── developer_agent.py         # AI Developer Agent with AutoGen
│   ├── documentation_agent.py     # Documentation generation agent
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Environment variables (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main React application
│   │   ├── api.js                # API utility functions
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # React entry point
│   ├── index.html                # HTML template
│   ├── package.json              # Node.js dependencies
│   ├── tailwind.config.js        # TailwindCSS configuration
│   └── vite.config.js            # Vite configuration
│
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini](https://deepmind.google/technologies/gemini/) for the powerful AI capabilities
- [Microsoft AutoGen](https://github.com/microsoft/autogen) for multi-agent orchestration
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework
- [React](https://react.dev/) for the frontend framework

---

### 👤 Author

Yeshwanth Goud

GitHub: YeshwanthMotivity
