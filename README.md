<div align="center">

# 🤝 Hamkar Team Manager

### Manage Smarter. Collaborate Better. Stay Organized.

A modern, responsive, and Persian-first team and project management application built with React and TypeScript.

Designed with a beautiful RTL interface, powerful task management features, and a seamless user experience.

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-View_Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zartoshtdev/Hamka-Team-Manager)

### 🌐 Live Application

[![Live Demo](https://img.shields.io/badge/Live_Demo-Launch_App-22C55E?style=for-the-badge&logo=googlechrome&logoColor=white)](https://hamkar-team-manager.netlify.app/)

[![Netlify](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://hamkar-team-manager.netlify.app/)

**Experience Hamkar Team Manager live:**

[hamkar-team-manager.netlify.app](https://hamkar-team-manager.netlify.app/)

<br/>

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/Material_UI-7-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Emotion](https://img.shields.io/badge/Emotion-11-DB7093?style=for-the-badge)
![Zustand](https://img.shields.io/badge/Zustand-5-764ABC?style=for-the-badge)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![dnd-kit](https://img.shields.io/badge/dnd--kit-Drag_&_Drop-7C3AED?style=for-the-badge)
![Recharts](https://img.shields.io/badge/Recharts-Data_Visualization-22B5BF?style=for-the-badge)

</div>

---

## 📖 About The Project

**Hamkar Team Manager** is a modern project management application designed to simplify team collaboration, task organization, and project tracking.

The application provides a centralized workspace where users can manage projects, organize team members, assign tasks, monitor progress, and improve productivity.

Built with a focus on performance, accessibility, and user experience, Hamkar features a fully responsive Persian interface with right-to-left (RTL) support.

The application works entirely in the browser without requiring a backend, server database, external API, or authentication system.

All user-generated information is stored locally using browser storage.

---

## ✨ Key Features

### 👥 Team Management
- Create, edit, and manage team members
- Organize project teams
- Assign project managers
- Manage member responsibilities

### 📁 Project Management
- Create and organize projects
- Assign team members to projects
- Manage project details
- Track project progress
- Organize project milestones

### ✅ Task Management
- Create, edit, and delete tasks
- Assign tasks to team members
- Set priorities and deadlines
- Manage task statuses
- Add labels and descriptions
- Create task dependencies
- Manage checklists and notes

### 📋 Kanban Board
- Visual task organization
- Drag-and-drop functionality
- Task status management
- Interactive task cards

### 📅 Calendar
- Persian (Jalali) date support
- Task deadline visualization
- Calendar-based task planning

### ⏱️ Time Tracking
- Track time spent on tasks
- Record work sessions
- Built-in task timer

### 📊 Reports & Analytics
- Project progress visualization
- Task statistics
- Interactive charts
- Reports based on actual user data

### 🔎 Productivity Tools
- Advanced search
- Filtering and sorting
- Pagination
- Bulk actions
- Archive and trash management

### 💾 Data Management
- Persistent browser storage
- JSON backup and restore
- CSV data export
- Data validation
- Versioned local storage

### 🎨 User Interface
- Fully Persian interface
- Right-to-left (RTL) layout
- Responsive design
- Light and dark themes
- Modern Material UI components
- Mobile-friendly navigation

---

## 🧱 Project Architecture

The project follows a feature-based architecture to keep the codebase organized, scalable, and maintainable.

```text
src/
│
├── app/
│   ├── Routes.tsx
│   ├── Providers.tsx
│   ├── Shell.tsx
│   └── theme.ts
│
├── features/
│   ├── dashboard/
│   ├── projects/
│   ├── members/
│   ├── tasks/
│   ├── kanban/
│   ├── calendar/
│   ├── reports/
│   ├── archive/
│   └── settings/
│
├── shared/
│   ├── types.ts
│   ├── schema.ts
│   ├── domain.ts
│   ├── storage.ts
│   └── store.ts
│
└── main.tsx
```

### Architecture Highlights

- Feature-based project structure
- Reusable React components
- Centralized theme configuration
- Type-safe development with TypeScript
- Zustand state management
- Schema validation with Zod
- Separation of business logic and presentation
- Lazy-loaded application routes

---

## ⚙️ Additional Technologies

The project also uses:

| Category | Technologies |
|----------|-------------|
| Routing | React Router |
| Styling | Emotion, Stylis RTL |
| Forms | React Hook Form Resolvers |
| Date Management | MUI Date Pickers, date-fns-jalali |
| Storage | Browser localStorage |
| Testing | Vitest, React Testing Library |
| E2E Testing | Playwright |
| Code Quality | ESLint, Prettier |
| Deployment | Netlify |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/zartoshtdev/Hamka-Team-Manager.git
```

### 2. Navigate to the Project

```bash
cd Hamka-Team-Manager
```

### 3. Install Dependencies

```bash
npm install
```

If the repository includes a valid `package-lock.json`, you can use `npm ci` for a reproducible installation.

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit and component tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run format:check` | Check code formatting |

---

## 🌐 Deployment

The project is configured for deployment on **Netlify**.

### Build Configuration

```text
Build Command: npm run build
Publish Directory: dist
Node Version: 22
```

The included `netlify.toml` provides deployment settings and SPA routing support.

Once deployment is completed, the live application URL will be added to the top of this README.

---

## 🔐 Privacy & Data Storage

Hamkar Team Manager is a browser-based application.

- No authentication required
- No backend server required
- No external database
- No external API integration
- User data stored in localStorage
- Data persists after page refresh
- JSON backup and restore support

**Note:** Data is stored locally in the browser and is not synchronized between devices. Clearing browser storage may remove saved information.

---

## 🎯 Project Purpose

This project was developed as a portfolio application to demonstrate modern frontend development practices.

It focuses on:

- React application architecture
- TypeScript development
- State management
- Complex form handling
- Data validation
- Responsive UI design
- RTL interface development
- Browser-based data persistence
- Component reusability
- Frontend testing

---

## 👨‍💻 Author

**Zartosht Dev**

GitHub: [@zartoshtdev](https://github.com/zartoshtdev)

---

<div align="center">

### 🤝 Hamkar Team Manager

**A Smarter Way to Manage Your Team.**

Built with ❤️ using React, TypeScript, and Material UI.

⭐ If you find this project useful, consider giving it a star!

</div>
