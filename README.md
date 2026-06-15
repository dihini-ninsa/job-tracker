# JobTracker — AI-Powered Job Application Tracker

A full-stack web application that helps students and fresh graduates manage their job search journey with AI-powered resume analysis, application tracking, and deadline management.

---

## 🌐 Live Demo

> Coming soon — deployment in progress

---

## 📸 Screenshots

| Home Page | Dashboard | AI Analyzer |
|-----------|-----------|-------------|
| ![Home](screenshots/home.png) | ![Dashboard](screenshots/dashboard.png) | ![Analyzer](screenshots/analyzer.png) |

---

## ✨ Features

### 👤 User Features
- **Application Tracker** — Add, edit, delete, and filter job applications by status (Applied, Interview, Offer, Rejected)
- **AI Resume Analyzer** — Upload your CV as PDF and paste a job description to get an instant match score, missing keywords, and improvement suggestions
- **Dashboard Analytics** — Visual pie chart and bar chart showing application status breakdown and weekly activity
- **Deadline Management** — Set deadlines for applications with overdue alerts highlighted in red
- **Export to CSV** — Download all your applications as a CSV file
- **Search & Sort** — Search applications by company or role, sort by newest, oldest, company name, or deadline
- **Profile Management** — Update your name, university, and target role

### 🛡️ Admin Features
- **Separate Admin Portal** — Completely isolated admin login at `/admin-login`
- **Platform Overview** — Total users, applications, interviews, offers, banned users, and new registrations this month
- **User Management** — View all users, ban/unban accounts, delete users and their data
- **View User Applications** — Click any user to see all their applications in a modal

### 🎨 UI/UX
- **Dark/Light mode** — Toggle on the home page
- **Responsive design** — Works on desktop and mobile
- **Animated transitions** — Framer Motion animations on dashboard and applications
- **Loading skeletons** — Skeleton loaders while data is fetching
- **Toast notifications** — Success and error notifications using react-hot-toast

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js (Vite) | Frontend framework |
| TailwindCSS v4 | Styling |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Recharts | Dashboard charts (Pie + Bar) |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Multer | File upload handling |
| Axios | Calling AI microservice |
| CORS | Cross-origin requests |
| dotenv | Environment variables |

### AI Microservice
| Technology | Purpose |
|-----------|---------|
| Python | Language |
| Flask | Web framework |
| PyPDF2 | PDF text extraction |
| scikit-learn | TF-IDF + Cosine Similarity |
| NumPy | Numerical operations |
| Flask-CORS | Cross-origin requests |

---

## 📁 Project Structure

```
job-tracker/
│
├── client/                          # React frontend
│   ├── public/
│   │   ├── home-bg.jpg              # Home page background
│   │   ├── login-bg.jpg             # Login page background
│   │   └── register-bg.jpg         # Register page background
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx           # Shared layout wrapper
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── Skeleton.jsx         # Loading skeleton components
│   │   │   └── Toast.jsx            # Toast notification setup
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   ├── api/
│   │   │   └── axios.js             # Axios instance with JWT interceptor
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Public landing page
│   │   │   ├── Login.jsx            # User login
│   │   │   ├── Register.jsx         # User registration
│   │   │   ├── Dashboard.jsx        # Main dashboard with charts
│   │   │   ├── Applications.jsx     # Application tracker
│   │   │   ├── Analyzer.jsx         # AI resume analyzer
│   │   │   ├── Profile.jsx          # User profile
│   │   │   ├── Admin.jsx            # Admin panel
│   │   │   └── AdminLogin.jsx       # Admin login
│   │   ├── App.jsx                  # Routes and auth guards
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js backend
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Application.js           # Application schema
│   ├── routes/
│   │   ├── auth.js                  # Register, login, profile
│   │   ├── applications.js          # CRUD + AI resume analysis
│   │   └── admin.js                 # Admin routes
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification
│   ├── server.js                    # Express app entry point
│   ├── .env                         # Environment variables
│   └── package.json
│
└── ai-service/                      # Python Flask AI microservice
    ├── app.py                       # Flask server
    ├── analyzer.py                  # TF-IDF resume analysis logic
    ├── requirements.txt             # Python dependencies
    └── Procfile                     # Deployment config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.8+
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobtracker
JWT_SECRET=your_secret_key_here
```

Run the backend:
```bash
npm run dev
```

### 3. Set up the AI service
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
python app.py
```

### 4. Set up the frontend
```bash
cd client
npm install
npm run dev
```

### 5. Open the app
```
http://localhost:5173
```

---

## 🔐 Authentication

### User Login
- Register at `/register`
- Login at `/login`

### Admin Login
- Go to `/admin-login`
- Email: `admin@jobtracker.com`
- Password: `Admin@2026`

---

## 🤖 How the AI Resume Analyzer Works

1. User uploads their CV as a PDF file
2. PyPDF2 extracts the text from the PDF
3. The job description is received as plain text
4. Both texts are cleaned and normalized
5. TF-IDF vectorizer converts both texts into numerical vectors
6. Cosine similarity measures how closely the CV matches the job description
7. Keyword extraction identifies which required skills are present or missing
8. Results including match score, found keywords, missing keywords, and suggestions are returned

---

## 📊 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| PUT | `/api/auth/profile` | Update profile |

### Application Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all user applications |
| POST | `/api/applications` | Add new application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| POST | `/api/applications/analyze-resume` | AI resume analysis |

### Admin Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/users` | All users |
| DELETE | `/api/admin/users/:id` | Delete user |
| PUT | `/api/admin/users/:id/ban` | Ban/unban user |
| GET | `/api/admin/users/:id/applications` | User's applications |

---

## 🌱 Future Improvements

- [ ] Deploy on Vercel + Render
- [ ] Email notifications for deadlines
- [ ] Mobile app with React Native
- [ ] LinkedIn job scraping integration
- [ ] Interview preparation tips per application
- [ ] Resume builder feature
- [ ] Team/collaborative job search

---

## 👩‍💻 Author

**Dihini Nihinsa Galappaththi**
- 📧 dgalappaththi.20@gmail.com
- 🔗 [LinkedIn](https://www.linkedin.com/in/dihini-nihinsa-7a794a312)
- 🐙 [GitHub](https://github.com/dihini-ninsa)
- 🎓 BSc (Hons) Data Science — SLIIT, Sri Lanka

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with ❤️ as a portfolio project to demonstrate full-stack development, AI/ML integration, and modern web application architecture.
